var uuid = require('node-uuid');

module.exports = function(orm, db){
  db.define('room', {
    socket_id: { type: 'text', required: true},
    drafters: { type: 'text' },  
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
        this.socket_id = uuid.v4();
      },
      beforeSave: this.draftersToString
    },
    validations: {
      socket_id: orm.enforce.ranges.length(1, 128)
    },
    methods: {
      draftersToString: function(){
        if(typeof(this.drafters) !== 'string'){
          this.drafters.join('-')
        }
      }, 
      draftersToArray: function(){
        if(typeof(this.drafters) === 'string' && (this.drafters.length > 0)){
          return this.drafters.split('-');
        }else{
          return [];
        }
      }
    }
  });

  db.models.room.hasOne('draft', db.models.draft, {
    reverse: 'room',
    autoFetch: true
  });
};