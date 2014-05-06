var controllers = require('../controllers')

module.exports = function (app) {

  //public routes

  app.get('/', controllers.home.get);
  app.post('/', controllers.home.signIn);
  app.delete('/', controllers.home.signOut);
  app.get('/user/:id', controllers.uzer.get);
  app.get('/signup', controllers.uzer.new);
  app.post('/signup', controllers.uzer.create);
  app.get('/league/:id', controllers.league.get);
  app.get('/draft/:leagueId',   controllers.draft.getLobby);
  app.get('/leagues', controllers.league.index)

  // restricted routes

  app.get('/league', restrictToLoggedInUzer, controllers.league.new);
  
  app.post('/league', restrictToLoggedInUzer, controllers.league.create);

  app.get('/league/:leagueId/draft', restrictToLoggedInUzer,
    restrictToLeagueCreator, controllers.draft.new);

  app.post('/league/:leagueId/draft', restrictToLoggedInUzer,
    restrictToLeagueCreator, controllers.draft.create);

  app.post('/draftee/:leagueId',  restrictToLoggedInUzer,
    restrictToLeagueCreator, controllers.draftee.create);

  app.post('/draft/:leagueId',  restrictToLoggedInUzer, 
    restrictToLeagueMembers, controllers.draft.makePick);
};

var uzer;

function restrictToLoggedInUzer(req, res, next){
  if(!req.session || !req.session.uzer_id){
    return next(new Error('Unauthorized'));
  }

  var seshedId = req.session.uzer_id;

  req.models.uzer.find({ id: seshedId }, function(err, result){
    if(err || result.length === 0){
      return next(new Error('Cannot find uzer'));
    }
    uzer = result[0];

    next();
  });
}

function restrictToLeagueCreator(req, res, next){
  var leagueId = parseInt(req.params.leagueId);
  var creator;

  // avoid hitting db for league.find and below middleware
  // or have more coherent code?
  //   for now: lets not hit the db, think more later.

  uzer.leagues.forEach(function(element, index){
    if((element.id === leagueId) && (element.isCreator)){
      creator = true;
      // more elegant work around possible?
    };
  });

// this should work fine since uzer.leagues gets autoFetched
  if(creator){
    next();
  }else{
    next(new Error('Only for league creator!'));
  }
}

function restrictToLeagueMembers(req, res, next){
  var leagueId = parseInt(req.params.leagueId);
  var member;

  uzer.leagues.forEach(function(element, index){
    if(element.id === leagueId){
      member = true;
    };
  });

  if(member){
    next()
  }else{
    next(new Error('Only league members may make picks, duh'));
  }
}

