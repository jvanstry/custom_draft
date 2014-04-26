process.env.NODE_ENV = 'test';

exports.clientSetup = function(){
  var jsdom = require('jsdom');

  window = jsdom.jsdom('<html><head></head><body><div id="rondavu_container"></div></body></html>').createWindow();

  if(Object.keys(window).length === 0) {
    throw "jsdom failed to create a usable environment, try uninstalling and reinstalling it";
  }

  global.window = window;

  global.document = window.document;

  global.C = require('../build/bundle.min.js');
};

exports.dbCreate = function(next){
  var exec = require('child_process').exec;
  var sqlLocation = '~/' + __dirname + '/testdb.sql';
  var dbLoadExecStr = 'psql -d custom_draft_test -f ' + sqlLocation;

  exec('createdb custom_draft_test', function(err){
    if(err){
      console.error('Error in test db creation: ', err);
    }
    exec(dbLoadExecStr, function(err){
      if(err){
        console.error('Error in test db loading: ', err);
      }
      next()
    })
  })
}

exports.dbSetup = function(next){
  var models = require('../models');
  
  models(function testDbSetUp(err, db){
    if(err){
      console.error('Error in test db setup: ', err);
    }

    global.models = db.models;
    global.db = db;
    
    next(); 
  });
};

exports.dbCleanup = function(next){
  var exec = require('child_process').exec;
  var sqlLocation = '~/' + __dirname + '/drop_testdb.sql';
  var dbDropExecStr = 'psql -d custom_draft_test -f ' + sqlLocation;

  exec(dbDropExecStr, function(err){
    if(err){
      console.error('Error in test db dropping: ', err);
    }

    next();
  });
}
