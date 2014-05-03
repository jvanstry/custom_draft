var app = require('express')();
var routes = require('./config/routes');
var environment = require('./config/environment');


environment(app);
routes(app);

app.start = function(){
  return this.listen(app.get('port'), function(){
    console.log("Express on port: " + app.get('port'));
  });
};

module.exports = app;