var bcrypt = require('bcrypt');

module.exports = function(orm, db){
  var Uzer = db.define('uzer', {
    name: { type: 'text', required: true },
    email: { type:'text', required: true },
    password_hash: { type: 'text', required: true },
    createdAt: { type: 'date', time: true }
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
      },
      beforeCreate: function(){
        this.password_hash = this.makePwHash();
      }
    },
    validations: {
      name: orm.enforce.ranges.length(1, 128),
      email: orm.enforce.unique(),
      password_hash: orm.enforce.ranges.length(1,128),
      email: orm.enforce.ranges.length(1,128)
    },
    methods: {
      makePwHash: function(){
        if(!this.password){
          return null;
        }

        var salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(this.password, salt);
      }
    },
    autoFetch: true
  });
};