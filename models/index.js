var settings = require('../settings');
var orm = require('orm');
var dbObj;

if(process.env.test){
  dbObj = settings.test
}else{
  dbObj = settings.database
}

var connection = null;

function setup(db, cb) {
  require('./uzer')(orm, db);
  require('./league')(orm, db); 
  require('./draft')(orm, db);
  require('./draftee')(orm, db);

  return cb(null, db);
}

module.exports = function (cb) {
  if (connection) return cb(null, connection);

  orm.connect(dbObj, function (err, db) {
    if (err) return cb(err);

    connection = db;
    db.settings.set('instance.returnAllErrors', true);
    setup(db, cb);
  });
};