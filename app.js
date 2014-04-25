var express = require('express');
var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http');
var pg = require('pg');
var routes = require('./routes/aggregated_routes');
var logger = require('morgan');
var path = require('path');
var connString = process.env.POSTGRES_CONNECT || 
  'postgres://postgres@localhost/custom_draft';

app.set('port', process.env.PORT || 4114);
app.set('views', __dirname + '/build/views');
app.set('view engine', 'ejs');
app.use(logger());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', routes.index);
// app.get('/lobby/:id', routes.lobby);
// app.get('/signup', routes.signup);


app.start = function(){
  return this.listen(app.get('port'), function(){
    console.log("Express on port: " + app.get('port'));
  });
};

module.exports = app;