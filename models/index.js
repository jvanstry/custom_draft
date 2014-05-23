var settings = require('../settings');
var orm = require('orm');
var dbObj;


var dbObj = settings.database[process.env.NODE_ENV || 'dev'];

var connection = null;

function setup(db, cb) {
  require('./uzer')(orm, db);
  require('./league')(orm, db); 
  require('./draft')(orm, db);
  require('./draftee')(orm, db);
  db.models.team = require('./team');

  return cb(null, db);
}

module.exports = function(cb) {
  if (connection) return cb(null, connection);

  orm.connect(dbObj, function (err, db) {
    if (err) return cb(err);

    connection = db;
    db.settings.set('instance.returnAllErrors', true);
    setup(db, cb);
  });
};