const GameSession = require('../models/gameSession');

exports.playerJoinEvent = function (socket, username) {
  const newPlayer = {
    handle: username,
    captain: false
  };

  const sessionCode = socket.handshake.query.sessionCode;

  return GameSession.findOneAndUpdate({sessionCode}, {$push: {playerList : newPlayer}}, {new: true})
    .then(updatedGame => {
      if (!updatedGame) {
        socket.nsp.to(socket.id).emit('error', 'Could not join game');
      } else {
        socket.nsp.to(sessionCode).emit('playerJoin', updatedGame.playerList);
      }
    })
    .catch(err => {
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};