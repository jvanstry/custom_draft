module.exports = function(orm, db){
  db.define('draft', {
    start_time: { type: 'date', required: true, time: true },
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
        this.start_time = Date.parse(new Date(this.start_time));
      }, 
      beforeSave: function(){
        this.start_time = new Date(this.start_time);
      }
    },
    validations: {
      start_time: orm.enforce.ranges.number(Date.now(), undefined, 'draft must be in future')
    },
    methods: {

    },
    cache: (process.env.NODE_ENV !== 'test')
  });
  
  db.models.draft.hasOne('league', db.models.league, {
    required: true,
    reverse: 'draft',
    autoFetch: true
  });
};
