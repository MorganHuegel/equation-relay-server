const { disconnectEvent } = require('./disconnectEvent');
const { playerJoinEvent } = require('./playerJoinEvent');
const { shuffleTeamsEvent } = require('./shuffleTeamsEvent');
const { startGameEvent } = require('./startGameEvent');
const { endGameEvent } = require('./endGameEvent');

function socketConnect(socket){
  const sessionCode = socket.handshake.query.sessionCode;
  console.log('USER JOINED', ' SESSION CODE: ', sessionCode, ' SOCKET ID: ', socket.id);
  socket.join(`${sessionCode}`);

  socket.on('playerJoin', (username) => playerJoinEvent(socket, username));
  socket.on('shuffleTeams', () => shuffleTeamsEvent(socket, sessionCode));
  socket.on('startGame', () => startGameEvent(socket, sessionCode));
  socket.on('endGame', () => endGameEvent(socket, sessionCode));
  socket.on('disconnect', () => disconnectEvent(socket));
}

module.exports = { socketConnect };