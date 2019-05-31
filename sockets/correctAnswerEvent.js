const { GameSession } = require('../models/gameSession');

exports.correctAnswerEvent = function (socket, sessionCode, teamId, playerId) {
  return GameSession.findOne({sessionCode})
    .then(gameData => {
      const team = gameData.teamList.find(team => team._id.toString() === teamId);

      team.players.forEach(player => {
        if (player._id.toString() === playerId) {
          player.alreadyGuessed = true;
          player.correctGuess = true;
        }
      });
      
      return GameSession.findOneAndUpdate({sessionCode, 'teamList._id': teamId}, {$set: {'teamList.$': team}}, {new: true});
    })
    .then(updatedGameData => {
      if (!updatedGameData) {
        return Promise.reject(new Error('Game didnt update for wrong answer, yo!'));
      }
      socket.nsp.to(sessionCode).emit('correctAnswer', updatedGameData);
    })
    .catch(err => {
      console.log('ERROR: ',err);
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};
