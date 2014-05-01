var orm = require('orm');

module.exports = {
  get: function(req, res, next){
    res.status(200);
    res.set('Content-Type', 'text/html');
    res.render('home.ejs', { title: 'home' }, function(err, html){
      if(err)
        console.log('/ Errored with: ', err);
      res.send(html);
    });
  },
  signIn: function(req, res, next){

  },
  signOut: function(req, res, next){

  }
};