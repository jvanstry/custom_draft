module.exports = function(orm, db){
  var Draft = db.define('draft', {
    start_time: { type: 'date', required: true, time: true },
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
      }
    },
    validations: {
      //TODO add validation for time in future
    },
    methods: {

    }
  });
  
  Draft.hasOne('league', db.models.league, {
    required: true,
    reverse: 'draft',
    autoFetch: true
  });

  Draft.sync();
};
