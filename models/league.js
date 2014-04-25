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

  League.hasOne('creator', db.models.users, {
    required: true,
    reverse: 'createdLeagues',
    autoFetch: true
  });
  League.hasMany('members', db.models.users)
  League.sync();
};
