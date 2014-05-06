var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var methodOverride = require('method-override');
var models = require('../models');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var compress = require('compression');
var sessionSecret = require('../settings').cookieSecret;

module.exports = function(app){
  app.set('port', process.env.PORT || 4114);
  // switch views path to ../build/views upon deployment
  app.set('views', path.join(__dirname, '../public/views'));
  app.set('view engine', 'ejs');

  app.use(favicon());
  app.use(logger('dev'));
  app.use(compress())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(session(
    { secret: sessionSecret, 
      cookie: { maxAge: 60 * 60 * 1000 }
    }
  ));
  app.use(express.static(path.join(__dirname, '../build')));
  app.use(function(req, res, next){
    next()
  })
  app.use(function (req, res, next) {
    models(function setUp(err, db) {
      if (err) return next(err);

      req.models = db.models;
      req.db     = db;
      
      return next();
    });
  });
}


