module.exports = function(orm, db){
  var Uzer = db.define('uzer', {
    name: { type: 'text', required: true },
    email: { type:'text', required: true },
    password_hash: { type: 'text', required: true },
    createdAt: { type: 'date', time: true },
  },
  {
    hooks: {
      beforeValidation: function(){
        this.createdAt = new Date();
      }
    },
    validations: {
      name: orm.enforce.ranges.length(1, 128),
      email: orm.enforce.unique(),
      password_hash: orm.enforce.ranges.length(1,128),
      email: orm.enforce.ranges.length(1,128)
    },
    methods: {

    },
    autoFetch: true
  });
};