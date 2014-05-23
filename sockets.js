module.exports = function(server){
  var io = require('socket.io').listen(server);
  
  io.sockets.on('connection', function (socket) {

    socket.on('join-room', function(roomId){
      socket.join(roomId);
      
      socket.emit('message', { name: 'Custo Drafto', 
        text: 'hello and welcome to your draft' });
    });

    socket.on('message', function(messageData){
      io.sockets.in(messageData.socketId).emit('message', messageData);
    });
    socket.on('pick-made', function (pickData) {
      var messageText = pickData.name + ' has selected ' + pickData.pickName;
      var messageData = {
        name: 'Custo Drafto',
        text: messageText
      }

      io.sockets.in(pickData.socketId).emit('message', messageData);
      io.sockets.in(pickData.socketId).emit('pick-made', pickData);
    });
    socket.on('disconnect', function(data){
      console.log(data)
    })
  });

}