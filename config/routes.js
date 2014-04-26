var controllers = require('../controllers')

module.exports = function (app) {
  app.get('/',            controllers.home.get);
  app.post('/',           controllers.home.signIn);
  app.delete('/',         controllers.home.signOut)

  app.get('/signup',      controllers.uzer.new);
  app.post('/signup',     controllers.uzer.create);
  app.get('/user/:id',    controllers.uzer.get);

  app.get('/league/:id',  controllers.league.get);
  app.get('/league',      controllers.league.new);
  app.post('/league',     controllers.league.create);

  app.get('/league/:leagueId/draft', 
                          controllers.draft.new);
  app.post('/league/:leagueId/draft', 
                          controllers.draft.create);
  app.get('/draft/:id',   controllers.draft.getLobby);
  app.post('/draft/:id',  controllers.draft.makePick);
};