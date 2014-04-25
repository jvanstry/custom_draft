var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('picks', {
    id: { type: 'int', primaryKey: true},
    user_id: 'int',
    draftee_id: 'int'

  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('picks', callback);
};
