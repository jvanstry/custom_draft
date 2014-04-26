module.exports = function(orm, db){
  var Uzer = db.define('uzer', {
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
};