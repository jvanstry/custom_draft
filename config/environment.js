var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser')();
var express = require('express');
var methodOverride = require('method-override')();
var models = require('../models');


module.exports = function(app){
  app.set('port', process.env.PORT || 4114);
  app.set('views', __dirname + '/../build/views');
  app.set('view engine', 'ejs');
  app.use(logger());
  app.use(bodyParser);
  app.use(methodOverride)
  app.use(express.static(path.join(__dirname, '../build')));
  // app.use(function (req, res, next) {
  //   models(function (err, db) {
  //     if (err) return next(err);

  //     req.models = db.models;
  //     req.db     = db;

  //     return next();
  //   });
  // });
}