var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('draft', {
    id: { type: 'int', primaryKey: true},
    start_time: 'timestamp',
    league_id: 'int',
    created_at: 'timestamp',
    updated_at: 'timestamp'

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('draft', callback);
};
