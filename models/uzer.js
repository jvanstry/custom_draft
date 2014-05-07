var pwHelper = require('./helpers/pw-helper');

module.exports = function(orm, db){
  db.define('uzer', {
    name: { type: 'text', required: true },
    email: { type:'text', required: true },
    password_hash: { type: 'text', required: true },
    createdAt: { type: 'date', time: true },
  },
  {
    hooks: {
      beforeCreate: function(){
        this.createdAt = new Date();
        this.setPwHash();
      },
      afterCreate: function(){
        // Hack for testing purposes otherwise setPwHash password_hash persists
        if(process.env.NODE_ENV === 'test'){
          this.password_hash = 'notSecurezYet';
        }
      }
    },
    /* jshint ignore:start */
    validations: {
      name: orm.enforce.ranges.length(1, 128),
      email: orm.enforce.unique(),
      password_hash: orm.enforce.ranges.length(1,128),
      email: orm.enforce.ranges.length(1,128)
    },
    /* jshint ignore:end */
    methods: {
      setPwHash: function(){
        this.password_hash = pwHelper.makePwHash(this.password_hash);
      }
    },
    autoFetch: true,
    cache: true
  });

  db.models.uzer.authenticate = function(email, password_attempt, cb){
    this.find({ email: email }, function(err, result){
      if(err){
        console.error(err);
      }else if(!result[0]){
        cb({ error: 'no uzer by that email found' });
      }else{
        pwHelper.decodePwHash(password_attempt, result[0], cb);
      }
    });
  };
};