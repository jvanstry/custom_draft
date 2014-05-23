module.exports = function(server){
  var io = require('socket.io').listen(server);
  
  io.sockets.on('connection', function (socket) {

    socket.on('join-room', function(roomId){
      console.log(roomId)
      // socket.broadcast.to(data.id).emit('drafter-joined', data.uzerId);
      // socket.emit('message', { name: 'Custo Drafto', 
      //   text: 'hello and welcome to your draft' });
    });

    socket.on('message', function(messageData){
      io.sockets.in(messageData.socketId).emit('message', messageData);
    });
    socket.on('pick-made', function (pickData) {
      io.sockets.in(pickData.socketId).emit('pick-made', pickData);
    });
    socket.on('disconnect', function(){
      console.log(data)
    })
  });

}