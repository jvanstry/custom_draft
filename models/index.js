var settings = require('../settings');
var orm = require('orm');

var connection = null;

function setup(db, cb) {
  require('./users')(orm, db);
  require('./league')(orm, db);
  require('./draft')(orm, db);
  require('./draftee')(orm, db);
  require('./pick')(orm, db);

  return cb(null, db);
}

module.exports = function (cb) {
  if (connection) return cb(null, connection);

  orm.connect(settings.database, function (err, db) {
    if (err) return cb(err);

    connection = db;
    db.settings.set('instance.returnAllErrors', true);
    setup(db, cb);
  });
};