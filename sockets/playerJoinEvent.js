const GameSession = require('../models/gameSession');

exports.playerJoinEvent = function (socket, username) {
  const newPlayer = {
    handle: username
  };

  const sessionCode = socket.handshake.query.sessionCode;

  //Makes sure player handle is unique and game has not started live
  return GameSession.findOne({sessionCode})
    .then(sessionData => {
      console.log(sessionData.teamList.length);
      if (!sessionData) {
        return Promise.reject(new Error(`Session ${sessionCode} does not exist`));
      } else if (sessionData.playerList.find(player => player.handle === username)) {
        socket.nsp.to(socket.id).emit('uniqueUsernameError', `The username ${username} is already taken. Choose another!`);
      } else if (sessionData.teamList.length > 0 || sessionData.startedGame) {
        console.log('HERE')
        return Promise.reject(new Error(`Session ${sessionCode} has already begun! You'll have to wait for the next round.`));
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
      console.log('IN CATCH BLOCK');
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};