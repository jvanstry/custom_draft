var orm = require('orm');

module.exports = {
  new: function(req, res, next){
    res.end('hi')

  },
  create: function(req, res, next){
    res.end('hi')
  },
  get: function(req, res, next){
    res.end('hi')
  }
};