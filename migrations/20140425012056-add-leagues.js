var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('leagues', {
    id: { type: 'int', primaryKey: true},
    name: { type: 'string', notNull: true },
    user_id: 'int'

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('leagues', callback);
};
