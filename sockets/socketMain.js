const { disconnectEvent } = require('./disconnectEvent');
const { playerJoinEvent } = require('./playerJoinEvent');

function socketMain(socket){
  const sessionCode = socket.handshake.query.sessionCode;
  console.log('USER JOINED', sessionCode);
  socket.join(`${sessionCode}`); // Create a ROOM for teacher and players

  // WORKING EXAMPLE OF EMITTING EVENTS
  //socket.broadcast.to(sessionCode).emit('testEvent', 'testEvent');

  socket.on('disconnect', () => disconnectEvent(socket));
  socket.on('playerJoin', (username) => playerJoinEvent(socket, username));
}

module.exports = { socketMain };