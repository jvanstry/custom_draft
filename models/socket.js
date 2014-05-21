function Socket(room, uzerId){
  this.room = room;
  this.drafters = room.draftersToArray();
  this.id = room.socket_id;
  this.uzerId = uzerId;
  var data = this;

  room.save(function(err, result){
    if(err){
      console.error(err);
    }
  });

  if(this.drafters && this.drafters.indexOf(uzerId.toString) == -1 ){
    this.drafters.push(uzerId);
    room.save(function(err, result){
      if(err){
        console.error(err);
      }
    });
  };
    
  io.sockets.on('connection', function (socket) {
    socket.join(data.id);

    socket.broadcast.to(data.id).emit('drafter-joined', data.uzerId);
    socket.emit('message', { message: 'hello and welcome to your draft' });

    socket.on('message', function(messageData){
      io.sockets.in(data.id).emit('message', messageData);
    });
    socket.on('pick-made', function (pickData) {
      io.sockets.in(data.id).emit('pick-made', pickData);
    });
  });
}

module.exports = function(draft, uzerId, cb){
  var room = draft.room[0];
  var uzerId = uzerId;

  if(!room){

  }else{
    new Socket(room, uzerId);
  }

  cb(room.socket_id);
};