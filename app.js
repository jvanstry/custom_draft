var app = require('express')();
var routes = require('./config/routes');
var environment = require('./config/environment');


environment(app);
routes(app);
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500);
});

app.start = function(){
  return this.listen(app.get('port'), function(){
    console.log("Express on port: " + app.get('port'));
  });
};
app.start();
module.exports = app;