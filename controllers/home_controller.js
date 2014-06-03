var merge = require('merge');

module.exports = {
  isUzerSignedIn: function(req, res, next){
    res.locals = {};
    if(req.session.uzer_id){
      res.locals.id = req.session.uzer_id
    }else{
      res.locals.id = undefined;
    }

    next();
  },
  get: function(req, res, next){
    var specificResLocals = {
      title: 'Custo Drafto',
      styles: ['home']
    };

    res.locals = merge(res.locals, specificResLocals);
    res.render('home');
  },
  signIn: function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;

    function userAuthCallback(uzer){
      if(!(uzer.error)){
        req.session.uzer_id = uzer.id;
//TODO: investigate if possible to use res.json within stubbed method
        res.locals.id = uzer.id;
        res.send(uzer);
      }else{
        res.send(401, { error: 'invalid credentials' });
      }
    }

    req.models.uzer.authenticate(email, password, userAuthCallback);
  },
  signOut: function(req, res, next){
    delete req.session;

    res.locals = { 
      title: 'Custo Drafto',
      justLoggedOut: true,
      styles: ['home'], 
      id: undefined 
    };

    res.render('home');
  }
};