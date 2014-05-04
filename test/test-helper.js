var exec = require('child_process').exec;
// require('./setup');

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

function doesDbExist(cb){
  var ls = exec('psql -l | grep custom_draft_test | wc -l', function(err){
    if(err){
      console.log('err determining db existence: ', err)
    }
  });

  ls.stdout.on('data', function dataResponder(data) {
    // exec command checks for existence of db
    // returns string representation of 1 or 0 
    // in 7th digit of string accordingly
    var dbExists = parseInt(data[7]);

    cb(dbExists)
  });
}

function loadDbFromSQLFile(next){
  var sqlLocation = __dirname + '/testdb.sql';
  var dbLoadExecStr = 'psql -d custom_draft_test -f ' + sqlLocation;

  exec(dbLoadExecStr, function(err){
    if(err){
      console.error('Error in test db loading: ', err);
    }
    next(err);
  });
}

exports.dbSetup = function(next){
  doesDbExist(function(dbExists){
    if(dbExists){
      loadDbFromSQLFile(next);
    }else{
      exec('createdb custom_draft_test', function(err){
        if(err){
          console.error('Error in test db creation: ', err);
        }
        loadDbFromSQLFile(next)
     })
    }
  })
}

exports.modelSetup = function(next){
  var models = require('../models');
  
  models(function testDbSetUp(err, db){
    if(err){
      console.error('Error in test db setup: ', err);
    }
    global.models = db.models;
    global.db = db;
    
    next(err); 
  });
};

exports.dbCleanup = function(next){
  var sqlLocation = __dirname + '/drop_testdb_schema.sql';
  var dbDropExecStr = 'psql -d custom_draft_test -f ' + sqlLocation;

  exec(dbDropExecStr, function(err){
    if(err){
      console.error('Error in test db dropping: ', err);
    }
    next();
  });
}

// sooooo hacky, FIX #1!
