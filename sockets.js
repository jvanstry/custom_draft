module.exports = function(server){
  var io = require('socket.io').listen(server);
  
  io.sockets.on('connection', function (socket) {
    console.log(socket);
    socket.on('message', function(data){
      socket.emit('message', data)
    });
    socket.on('pick-made', function (data) {
    });
  });

}