var controllers = require('../controllers')

module.exports = function (app) {

  //public routes

  app.get('/', controllers.home.get);
  app.post('/', controllers.home.signIn);
  app.delete('/', controllers.home.signOut);
  app.get('/user/:uzerId', controllers.uzer.get);
  app.get('/signup', controllers.uzer.new);
  app.post('/signup', controllers.uzer.create);
  app.get('/league/:leagueId', controllers.league.get);
  app.get('/draft/:leagueId', controllers.socket.setupSocket, 
    controllers.draft.getLobby);
  app.get('/draft-info/:leagueId', controllers.draft.draftJSON);
  app.get('/leagues', controllers.league.index);

  // restricted routes

  app.get('/league', restrictToLoggedInUzer, controllers.league.new);
  
  app.post('/league', restrictToLoggedInUzer, controllers.league.create);

  app.get('/league/:leagueId/draft', restrictToLoggedInUzer,
    restrictToLeagueCreator, controllers.draft.new);

  app.post('/league/:leagueId/draft', restrictToLoggedInUzer,
    restrictToLeagueCreator, controllers.draft.create);

  app.post('/draftee/:leagueId',  restrictToLoggedInUzer,
    restrictToLeagueCreator, controllers.draftee.create);

  app.post('/start-draft/:leagueId',  restrictToLoggedInUzer,
    restrictToLeagueCreator, controllers.draft.startDraft);

  app.post('/draft/:draftId',  restrictToLoggedInUzer, 
    restrictToActivePicker, controllers.draft.makePick);

  // app.post('/draft/:draftId',   controllers.draft.makePick);
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

function storeDraftOrderInSession(draft, req){
  var draftOrderKey = 'draft' + draft.id + 'order';
  var draftOrderIsSet = draft.order;
  var draftOrderIsNotInSesh = !req.session[draftOrderKey];

  if(draftOrderIsSet && draftOrderIsNotInSesh){
    req.session[draftOrderKey] = draft.order;
  }
}

function restrictToActivePicker(req, res, next){
  var draftId = parseInt(req.params.draftId);

  req.models.draft.get(draftId, function(err, result){
    storeDraftOrderInSession(result, req)

    if(err || !result){
      return next(new Error ('node orm error: ', err));
    }else if(!result){
      return next(new Error ('cant find draft'));
    }else if(!result.active_picker_id){
      return next(new Error ('draft is not live'));
    }else if (uzer.id === result.active_picker_id){
      return next();
    }
    next(new Error('only active picker can pick duh!'));
  });
}

