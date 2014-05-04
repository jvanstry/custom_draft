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
  app.get('/draft/:id',   controllers.draft.getLobby);
  app.get('/leagues', controllers.league.index)

  // restricted routes

  app.get('/league', restrictToLoggedInUzer, controllers.league.new);
  
  app.post('/league', restrictToLoggedInUzer, controllers.league.create);

  app.get('/league/:leagueId/draft', restrictToLoggedInUzer,
    restrictToLeagueCreator, controllers.draft.new);

  app.post('/league/:leagueId/draft', restrictToLoggedInUzer,
    restrictToLeagueCreator, controllers.draft.create);

  app.post('/draft/:leagueId',  restrictToLoggedInUzer, 
    restrictToLeagueMember, controllers.draft.makePick);
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

      var membershipLeaguesIds = getMemberLeagues(result[0]);

      uzer = result[0];
      next();
    });
}

function getMemberLeagues(uzer){
  var membershipLeaguesIds = [];

  for(var i=0; i < uzer.leagues; i++){
    var leagueId = uzer.leagues[i].id;
    membershipLeaguesIds.push(leagueId);
  }

  return membershipLeaguesIds;
}

function restrictToLeagueCreator(req, res, next){
  var leagueId = parseInt(req.params.leagueId);

  req.models.league.find({ id: leagueId }, function(err, result){
    if(err){
      return next(new Error('Cannot find league'));
    }

    var creatorId = result[0].creator_id;

    if(creatorId === uzer.id){
      return next();
    }

    next(new Error('Only league '))
  });
}

function restrictToLeagueMember(req, res, next){
  var leagueId = parseInt(req.params.leagueId);
  console.log(leagueId, uzer);
  var isLeagueMember = inArray(uzer.leagues, leagueId)

  if(isLeagueMember){
    next()
  }else{
    next(new Error('Unauthorized'));
  }
}


function inArray(array, value) {
  for (var i = 0; i < array.length; i++){
    if (array[i] == value){
      return true;
    }
  }    
  return false;
}