var app = require('express')();
var routes = require('./config/routes');
var environment = require('./config/environment');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


environment(app);
routes(app);
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500);
});

app.start = function(){
  server.listen(app.get('port'), function(){
    console.log("Express on port: " + app.get('port'));
  });
};

module.exports = app;