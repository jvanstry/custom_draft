module.exports = function(orm, db){
  db.define('league', {
    name: { type: 'text', required: true },
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
      }
    },
    validations: {
      name: orm.enforce.ranges.length(1, 128)
    },
    methods: {

    },
    cache: (process.env.NODE_ENV !== 'test')
  });
  
  db.models.uzer.hasMany('leagues', db.models.league, 
    { 
      isCreator: { type: 'boolean', defaultValue: false }, 
      join_id: { type: 'serial', primaryKey: true } 
    },
    { 
      reverse: 'members',
      cache: (process.env.NODE_ENV !== 'test')
    });
};
