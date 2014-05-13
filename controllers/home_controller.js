module.exports = {
  get: function(req, res, next){
    res.locals = {
      title: 'Custo Drafto',
      styles: ['home']
    };
    res.render('home');
  },
  signIn: function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;

    function userAuthCallback(uzer){
      if(!(uzer.error)){
        req.session.uzer_id = uzer.id;
//TODO: investigate if possible to use res.json within stubbed method
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
      styles: ['home'] 
    };

    res.render('home');
  }
};