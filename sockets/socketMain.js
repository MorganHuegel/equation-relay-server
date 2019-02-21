const { disconnectEvent } = require('./disconnectEvent');
const { playerJoinEvent } = require('./playerJoinEvent');
const { shuffleTeamsEvent } = require('./shuffleTeamsEvent');

function socketConnect(socket){
  const sessionCode = socket.handshake.query.sessionCode;
  console.log('USER JOINED', ' SESSION CODE: ', sessionCode, ' SOCKET ID: ', socket.id);
  socket.join(`${sessionCode}`);

  socket.on('playerJoin', (username) => playerJoinEvent(socket, username));
  socket.on('shuffleTeams', () => shuffleTeamsEvent(socket, sessionCode));
  socket.on('disconnect', () => disconnectEvent(socket));
}

module.exports = { socketConnect };