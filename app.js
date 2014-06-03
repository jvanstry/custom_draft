var app = require('express')();
var routes = require('./config/routes');
var environment = require('./config/environment');
var server = require('http').createServer(app);
var sockets = require('./sockets.js');
var livereload = require('connect-livereload');




if(process.env.NODE_ENV === 'dev'){
  app.use(livereload({port: 35729}));
}

environment(app);
routes(app);
sockets(server);

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500);
});

app.start = function(){
  return server.listen(app.get('port'), function(){
    console.log("Express on port: " + app.get('port'));
  });
};

module.exports = app;