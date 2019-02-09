const { disconnectEvent } = require('./disconnectEvent');
const { playerJoinEvent } = require('./playerJoinEvent');

function socketConnect(socket){
  const sessionCode = socket.handshake.query.sessionCode;
  console.log('USER JOINED', ' SESSION CODE: ', sessionCode, ' SOCKET ID: ', socket.id);
  socket.join(`${sessionCode}`);

  // WORKING EXAMPLE OF EMITTING EVENTS
  //socket.broadcast.to(sessionCode).emit('testEvent', 'testEvent');

  socket.on('playerJoin', (username) => playerJoinEvent(socket, username));
  socket.on('disconnect', () => disconnectEvent(socket));
}

module.exports = { socketConnect };