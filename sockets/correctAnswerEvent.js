const GameSession = require('../models/gameSession');

exports.correctAnswerEvent = function (socket, sessionCode, teamId) {
  return GameSession.findOne({sessionCode})
    .then(gameData => {
      //Find the team that answered, update with 10 points
      const teamData = gameData.teamList.find(team => team._id.toString() === teamId);
      teamData.guessingForPoints = true;
      return GameSession.findOneAndUpdate({sessionCode, 'teamList._id': teamId}, {$set: {'teamList.$': teamData}}, {new: true});
    })
    .then(updatedGameData => {
      if (!updatedGameData) {
        return Promise.reject(new Error('Did not update in correct answer event, yo!'));
      }
      socket.nsp.to(sessionCode).emit('correctAnswer', updatedGameData);
    })
    .catch(err => {
      console.log('ERROR: ',err);
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};