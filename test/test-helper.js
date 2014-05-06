var exec = require('child_process').exec;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var app = require('../app.js').start();
var request = require('super-request');
require('./setup');

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
    // in 8th digit of string accordingly
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

exports.logInWithLeagueCreator = function(){
  return request(app)
    .post('/')
    .form({ email: 'jer@example.com', password: 'notSecurezYet' })
    .expect(200).end()
}

exports.logInWithActivePicker = function(){
  return request(app)
    .post('/')
    .form({ email: 'jer@foo.com', password: 'notSecurezYet' })
    .expect(200).end()
}

exports.logInWithLeagueMember = exports.logInWithActivePicker;

exports.seed = function(next){
  var Counter = function(){ this.count = 0; };
  util.inherits(Counter, EventEmitter);

  var counter = new Counter();
  var league;
  var uzer;

  function uzerCreator(email){
    models.uzer.create({ name: 'jerbear', email: email, 
      password_hash: 'notSecurezYet' }, 
      function(err, result){
        counter.count++;
        counter.emit('save-success');
    });
  }

  function uzerLeagueAdder(uzerId, isCreator){
    models.uzer.get(uzerId, function(err, result){
      result.addLeagues(league, { isCreator: isCreator}, function(err){
        counter.count++;
        counter.emit('save-success');
      });
    });    
  }

  function respondToSaveAttempt(err, result){
    if(err){
      console.error(err)
    }else if(result.name === 'jerbear league'){
      league = result;
    }
    counter.count++
    counter.emit('save-success');
  };

  counter.on('save-success', function(){
    if(this.count === 3){
      uzerCreator('jer@example.com');
    }else if(this.count === 4){
      uzerLeagueAdder(1, true);
    }else if(this.count === 5){
      uzerCreator('jer@foo.com');
    }else if(this.count === 6){
      uzerLeagueAdder(2, false);
    }else if(this.count > 6){
      next();
    }
  });

  models.league.create({ name: 'jerbear league' }, respondToSaveAttempt);

  models.draft.create({ start_time: new Date(1497758400000), league_id: 1, 
    order: '21', active_picker_id: 2 }, respondToSaveAttempt);

  models.draftee.create({ name: 'jerry', draft_id: 1 }, respondToSaveAttempt);
}
