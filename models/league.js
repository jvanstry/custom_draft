module.exports = function(orm, db){
  var League = db.define('league', {
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

    }
  });

  League.hasOne('creator', db.models.user, {
    required: true,
    reverse: 'createdLeagues',
    autoFetch: true
  });
};
