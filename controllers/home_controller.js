var orm = require('orm');

module.exports = {
  get: function(req, res, next){
    res.status(200);
    res.set('Content-Type', 'text/html');
    res.render('home.ejs', { title: 'home' });
  },
  signIn: function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;

    res.status(200);

    function callback(uzer){
      if(!(uzer.error)){
        // put in session cookies
        res.send(uzer);
      }else{
        res.send({ error: 'invalid credentials' })
      }
    }

    req.models.uzer.authenticate(email, password, callback);
  },
  signOut: function(req, res, next){

  }
};