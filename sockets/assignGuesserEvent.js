const { GameSession } = require('../models/gameSession');

exports.assignGuesserEvent = function (socket, sessionCode, teamId) {
  return GameSession.findOne({sessionCode})
    .then(gameData => {
      const team = gameData.teamList.find(team => team._id.toString() === teamId);

      const randomPlayerIndex = Math.floor((Math.random() * team.players.length));
      team.players[randomPlayerIndex].guessingForPoints = true;
      return GameSession.findOneAndUpdate({sessionCode, 'teamList._id': teamId}, {$set: {'teamList.$': team}}, {new: true});
    })
    .then(updatedGameData => {
      if (!updatedGameData) {
        return Promise.reject(new Error('Game didnt update for assignGuesserEvent, yo!'));
      }
      socket.nsp.to(sessionCode).emit('assignGuesser', updatedGameData);
    })
    .catch(err => {
      console.log('ERROR: ',err);
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};