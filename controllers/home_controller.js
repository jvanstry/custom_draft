var orm = require('orm');

module.exports = {
  get: function(req, res, next){
    req.session.uzer_id = 1;
    res.render('home', { title: 'home' });
  },
  signIn: function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;

    function callback(uzer){
      if(!(uzer.error)){
        req.session.uzer_id = uzer.id;
        //TODO: investigate if possible to use res.json within stubbed method
        res.send(uzer);
      }else{
        res.send(401, { error: 'invalid credentials' })
      }
    }

    req.models.uzer.authenticate(email, password, callback);
  },
  signOut: function(req, res, next){
    delete req.session;

    res.locals = { title: 'home', justLoggedOut: true }
    res.render('home')
  }
};