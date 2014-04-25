var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('draftee', {
    id: { type: 'int', primaryKey: true },
    name: { type: 'string', notNull: true },
    available: { type: 'boolean', defaultValue: true },
    draft_id: 'int',
    created_at: 'timestamp',
    updated_at: 'timestamp'

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('draftee', callback);
};
