var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('draftees', {
    id: { type: 'int', primaryKey: true },
    name: { type: 'string', notNull: true },
    available: { type: 'string', defaultValue: 'yes' },
    draft_id: 'int'

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('draftees', callback);
};
