var _ = require('lodash-node');
var orm = require('orm');

module.exports = {
  get: function(req, res, next){
    req.models.users.create({ name: 'jerry' }, function(err, message){
      if(err) console.log(err);
      
    });
    res.render('home', {title: 'jer'});
  },
  signIn: function(req, res, next){

  },
  signOut: function(req, res, next){

  }
};