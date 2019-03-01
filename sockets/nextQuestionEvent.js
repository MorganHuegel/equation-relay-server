const { GameSession } = require('../models/gameSession');

module.exports = function nextQuestionEvent(socket, sessionCode){
  return GameSession.findOne({sessionCode})
    .then(gameData => {
      
    })
    .catch(err => {
      socket.nsp.to(socket.id).emit('error', err.message);
    });
};