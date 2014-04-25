var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
    id: { type: 'int', primaryKey: true},
    name: { type: 'string', notNull: true },
    email: 'string',
    password_hash: 'string',
    created_at: 'timestamp',
    updated_at: 'timestamp'

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
