var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('drafts', {
    id: { type: 'int', primaryKey: true},
    start_time: 'timestamp',
    league_id: 'int'

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('drafts', callback);
};
