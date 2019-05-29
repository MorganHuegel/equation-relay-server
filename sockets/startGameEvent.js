const { GameSession } = require('../models/gameSession');

exports.startGameEvent = function (socket, sessionCode) {
  return GameSession.findOneAndUpdate({sessionCode}, {$set: {startedGame: true}}, {new: true})
    .then(updatedGame => {
      if (!updatedGame) {
        return Promise.reject(new Error(`Game did not start.`));
      }
      socket.nsp.to(sessionCode).emit('startGame', updatedGame);
    })
    .catch(err => {
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};