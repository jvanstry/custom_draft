var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('pick', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: 'int',
    draftee_id: 'int',
    overallPick: 'int',
    createdAt: 'timestamp'

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('pick', callback);
};
