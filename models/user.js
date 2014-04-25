module.exports = function(orm, db){
  var User = db.define('user', {
    name: { type: 'text', required: true },
    email: { type:'string' },
    password_hash: { type: 'string' },
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

  User.hasMany('leagues', db.models.league, { reverse: 'members' });
};