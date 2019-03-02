const GameSession = require('../models/gameSession');

exports.wrongAnswerEvent = function (socket, sessionCode, teamId, playerId) {
  console.log('PLAYER ID', playerId)
  console.log('TEAM ID', teamId)
  console.log('WRONG< YO!')
};