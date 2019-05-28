const { GameSession } = require('../models/gameSession');

exports.endGameEvent = function (socket, sessionCode) {
  return GameSession.findOneAndDelete({sessionCode})
    .then(deletedGameData => {
      deletedGameData.endedGame = true;
      socket.nsp.to(sessionCode).emit('endGame', deletedGameData);
    })
    .catch(err => {
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};