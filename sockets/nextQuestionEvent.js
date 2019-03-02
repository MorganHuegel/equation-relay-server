const GameSession = require('../models/gameSession');

exports.nextQuestionEvent = function (socket, sessionCode, teamId, playerId) {
  return GameSession.findOne({sessionCode})
    .then(gameData => {
      let teamList = [...gameData.teamList];
      teamList.forEach(team => {
        team.players.sort((playerA, playerB) => {
          return playerA._id.toString().localeCompare(playerB._id.toString());
        });
      });

      const isFirstPlayerIndex = teamList.findIndex(team => {
        return team.players[0]._id.toString() === playerId.toString();
      });

      //Only update team data for one player on each team
      if (isFirstPlayerIndex === -1) {
        return false;
      } else {
        const team = teamList[isFirstPlayerIndex];
        team.currentQuestion++;
        
        let questionIndexOptions = [];
        const numOfPlayers = team.players.length;
        for (let i = 0; i < numOfPlayers; i++) {
          questionIndexOptions.push(i);
        }
        for (let j = 0; j < numOfPlayers; j++) {
          const index = Math.floor(Math.random() * questionIndexOptions.length);
          team.players[j].assignedEquationIndex = questionIndexOptions[index];
          questionIndexOptions.splice(index, 1);
        }

        return GameSession.findOneAndUpdate({sessionCode, 'teamList._id': teamId}, {$set: {'teamList.$': team}}, {new: true});
      }
    })
    .then(updatedGameData => {
      socket.nsp.to(sessionCode).emit('nextQuestion', updatedGameData);
    })
    .catch(err => {
      console.log('ERROR: ',err);
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};