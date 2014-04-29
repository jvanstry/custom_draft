var bcrypt = require('bcrypt');

module.exports = function(password){
  if(!password){
    return null;
  }
  
  console.log(password, 'in method');
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}