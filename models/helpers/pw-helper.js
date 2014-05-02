var bcrypt = require('bcrypt');

exports.makePwHash = function(password){
  if(!password){
    return null;
  }
  
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

exports.decodePwHash = function(password_attempt, uzer, cb){
  bcrypt.compare(password_attempt, uzer.password_hash, function(err, res){
    if(err){
      console.error(err)
    }else if(res){
      cb(uzer);
    }else{
      cb({ error: 'not valid password' })
    }
  })
};