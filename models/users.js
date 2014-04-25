module.exports = function(orm, db){
  var Users = db.define('users', {
    name: { type: 'text', required: true },
    email: { type:'text' },
    password_hash: { type: 'text' },
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
    autoFetch: true
  });

  Users.hasMany('leagues', db.models.league)
};