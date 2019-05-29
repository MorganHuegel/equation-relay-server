const { GameSession } = require('../models/gameSession');

exports.removePlayer = function (socket, playerId, sessionCode) {
  return GameSession.findOne({sessionCode})
    .then(sessionData => {
      const newPlayerList = sessionData.playerList.filter(player => player._id.toString() !== playerId);
      sessionData.playerList = newPlayerList;

      if (sessionData.teamList.length > 0) {
        const oldTeam = sessionData.teamList.find(team => {
          return team.players.find(player => player._id.toString() === playerId);
        });
        oldTeam.players = oldTeam.players.filter(player => player._id.toString() !== playerId);
      }
      return GameSession.findOneAndUpdate({sessionCode}, sessionData, {new: true});
    })
    .then(updatedGame => {
      socket.nsp.to(sessionCode).emit('playerRemoved', updatedGame);
    })
    .catch(err => {
      if (!err.type) {
        return socket.nsp.to(socket.id).emit('error', err.message);
      } else {
        return socket.nsp.to(socket.id).emit(err.type, err.message);
      }
    });
};