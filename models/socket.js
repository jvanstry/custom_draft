function Socket(room, uzerId){
  this.room = room;
  this.drafters = room.draftersToArray();
  this.id = room.id;
  this.uzerId = uzerId;

  if(this.drafters && this.drafters.indexOf(uzerId.toString) == -1 ){
    this.room.drafters.push(uzerId);
  };
  
  // var io = require('socket.io').listen(process.env.SERVER);
    
  io.sockets.on('connection', function (socket) {
    console.log(socket);
    socket.on('message', function(data){
      socket.emit('message', data)
    });
    socket.on('pick-made', function (data) {
    });
  });
}



Socket.prototype.setupSocket = function(req, res, next){
    var uzerId = req.session.uzer_id;
    uzerId = 1;
    //todo get this out
    if(!uzerId){
      return next();
    }

    var leagueId = parseInt(req.params.leagueId);

    req.models.league.get(leagueId, function(err, result){
      if(err){
        console.error(err)
      }

      console.log(result.members);
      next();
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