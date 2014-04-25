var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('draft', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    start_time: 'timestamp',
    league_id: 'int',
    createdAt: 'timestamp'
    
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('draft', callback);
};
