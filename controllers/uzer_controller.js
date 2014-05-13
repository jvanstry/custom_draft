var orm = require('orm');

module.exports = {
  new: function(req, res, next){
    res.locals = {
      title: 'Signup',
      styles: ['new-uzer']
    };

    res.render('new-uzer');
  },
  create: function(req, res, next){
    var uzerInfo = req.body;
    
    req.models.uzer.create(uzerInfo, function(err, result){
      if(err){
        console.error(err);
      }

      var uzerId = result.id;
      var uzerHomeURL = 'user/' + uzerId;

      res.redirect(uzerHomeURL);
    });
  },
  get: function(req, res, next){
    var uzerId = parseInt(req.params.uzerId);

    req.models.uzer.find({ id: uzerId }, function(err, result){
      if(err){
        console.err(err);
      }

      var uzerName = result[0].name;
      var pageTitle = uzerName + ' home';

      res.locals = {
        title: pageTitle,
        styles: ['uzer'],
        uzer: result[0]
      };

      res.render('uzer');
    });   
  }
};