var uuid = require('node-uuid');

module.exports = function(orm, db){
  db.define('room', {
    socket_id: { type: 'text', required: true},
    drafters: { type: 'text' },  
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeCreate: function(){
        this.socket_id = uuid.v4();
      },
      beforeValidation: function(){
        this.createdAt = new Date();
      },
      beforeSave: function(){
        if(this.drafters && typeof(this.drafters) !== 'string'){
          this.drafters = this.drafters.join('-');
        }
      }
    },
    validations: {
      socket_id: orm.enforce.ranges.length(1, 128)
    },
    methods: {
      draftersToArray: function(){
        if(typeof(this.drafters) === 'string' && (this.drafters.length > 0)){
          var splitted = this.drafters.split('-');
          var toNumArray;
          splitted.forEach(function(el){
            toNumArray = [];
            toNumArray.push(parseInt(el));
          })
          return toNumArray;
        }else{
          return this.drafters || [];
        }
      }
    },
    cache: false
  });

  db.models.room.hasOne('draft', db.models.draft, {
    reverse: 'room',
    autoFetch: true
  });
};