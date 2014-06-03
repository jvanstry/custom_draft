var merge = require('merge');

module.exports = {
  new: function(req, res, next){
    var specificResLocals = {
      title: 'Signup',
      styles: ['new-uzer']
    };

    res.locals = merge(res.locals, specificResLocals);
    res.render('new-uzer');
  },
  create: function(req, res, next){
    var uzerInfo = req.body;
    uzerInfo.password_hash = uzerInfo.password;
    
    req.models.uzer.create(uzerInfo, function(err, result){
      if(err){
        console.error(err);
      }

      var uzerId = result.id;
      req.session.uzer_id = res.locals.id = uzerId; 
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

      var specificResLocals = {
        title: pageTitle,
        styles: ['uzer'],
        uzer: result[0]
      };

      res.locals = merge(res.locals, specificResLocals);
      res.render('uzer');
    });   
  }
};