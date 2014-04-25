var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('league', {
    id: { type: 'int', primaryKey: true},
    name: { type: 'string', notNull: true },
    user_id: 'int',
    created_at: 'timestamp',
    updated_at: 'timestamp'

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('league', callback);
};
