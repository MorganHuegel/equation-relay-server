
function socketMain(socket){
  const sessionCode = socket.handshake.query.sessionCode;
  console.log('USER JOINED');
  socket.on("disconnect", () => console.log("Client disconnected"));
}

module.exports = { socketMain };