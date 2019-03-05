const { disconnectEvent } = require('./disconnectEvent');
const { playerJoinEvent } = require('./playerJoinEvent');
const { shuffleTeamsEvent } = require('./shuffleTeamsEvent');
const { startGameEvent } = require('./startGameEvent');
const { endGameEvent } = require('./endGameEvent');
const { nextQuestionEvent } = require('./nextQuestionEvent');
const { teamScoredEvent } = require('./teamScoredEvent');
const { wrongAnswerEvent } = require('./wrongAnswerEvent');
const { correctAnswerEvent } = require('./correctAnswerEvent');
const { assignGuesserEvent } = require('./assignGuesserEvent');

function socketConnect (socket) {
  const sessionCode = socket.handshake.query.sessionCode;
  console.log('USER JOINED', ' SESSION CODE: ', sessionCode, ' SOCKET ID: ', socket.id);
  socket.join(`${sessionCode}`);

  socket.on('playerJoin', (username) => playerJoinEvent(socket, username));
  socket.on('shuffleTeams', () => shuffleTeamsEvent(socket, sessionCode));
  socket.on('startGame', () => startGameEvent(socket, sessionCode));
  socket.on('nextQuestion', ({teamId, playerId}) => nextQuestionEvent(socket, sessionCode, teamId, playerId));
  socket.on('wrongAnswer', ({teamId, playerId}) => wrongAnswerEvent(socket, sessionCode, teamId, playerId));
  socket.on('correctAnswer', ({teamId, playerId}) => correctAnswerEvent(socket, sessionCode, teamId, playerId));
  socket.on('assignGuesser', (teamId) => assignGuesserEvent(socket, sessionCode, teamId));
  socket.on('teamScored', ({teamId, pointValue}) => teamScoredEvent(socket, sessionCode, teamId, pointValue));
  socket.on('endGame', () => endGameEvent(socket, sessionCode));
  socket.on('disconnect', () => disconnectEvent(socket));
}

module.exports = { socketConnect };