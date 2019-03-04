const GameSession = require('../models/gameSession');

exports.teamScoredEvent = function (socket, sessionCode, teamId, playerId, pointValue) {
  return GameSession.findOne({sessionCode})
    .then(gameData => {
      //Find the team that answered, update with 10 points
      const teamData = gameData.teamList.find(team => team._id.toString() === teamId);
      teamData.points += pointValue;
      return GameSession.findOneAndUpdate({sessionCode, 'teamList._id': teamId}, {$set: {'teamList.$': teamData}}, {new: true});
    })
    .then(updatedGameData => {
      socket.nsp.to(sessionCode).emit('teamScored', updatedGameData);
    })
    .catch(err => {
      console.log('ERROR: ',err);
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};