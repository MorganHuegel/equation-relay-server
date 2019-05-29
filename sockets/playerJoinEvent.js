const { GameSession } = require('../models/gameSession');

exports.playerJoinEvent = function (socket, username, sessionCode) {
  const newPlayer = {
    handle: username
  };

  //Makes sure player handle is unique and game has not started live
  return GameSession.findOne({sessionCode})
    .then(sessionData => {
      if (!sessionData) {
        const err = new Error(`Session ${sessionCode} does not exist`);
        err.type = 'noSessionExists';
        return Promise.reject(err);

      } else if (sessionData.teamList.length > 0 || sessionData.startedGame) {
        const err = new Error(`Session ${sessionCode} has already begun! You'll have to wait for the next round.`);
        err.type = 'alreadyBegunError';
        return Promise.reject(err);      
      
      } else if (sessionData.playerList.find(player => player.handle === username)) {
        const err = new Error(`The username ${username} is already taken. Choose another!`);
        err.type = 'uniqueUsernameError';
        return Promise.reject(err);

      } else {
        return GameSession.findOneAndUpdate({sessionCode}, {$push: {playerList : newPlayer}}, {new: true});
      }
    })
    .then(updatedGame => {
      if (!updatedGame) {
        return Promise.reject(new Error('Could not join game'));
      } else {
        socket.nsp.to(sessionCode).emit('playerJoin', updatedGame);
      }
    })
    .catch(err => {
      if (!err.type) {
        return socket.nsp.to(socket.id).emit('error', err.message);
      } else {
        return socket.nsp.to(socket.id).emit(err.type, err.message);
      }
    });
};