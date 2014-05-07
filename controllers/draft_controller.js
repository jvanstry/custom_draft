module.exports = {
  new: function(req, res, next){
    res.locals = {
      title: 'New Draft',
      styles: ['new-draft']
    };
    res.render('new-draft');
  },
  create: function(req, res, next){
    var startTime = parseInt(req.body.start_time);
    var leagueId = parseInt(req.params.leagueId);
    var redirectUrl = '/draft/' + leagueId;

    req.models.draft.create({ start_time: startTime, league_id: leagueId }, 
      function(err, result){   
        if(err){
          console.error(err);
        }

        res.redirect(redirectUrl);
    });
 
  },
  getLobby: function(req, res, next){
    var leagueId = parseInt(req.params.leagueId);

    req.models.draft.find({ league_id: leagueId }, function(err, result){
      if(err){
        console.error(err)
      }

      res.locals = {
        title: result[0].name + ' draft lobby',
        styles: ['draft-lobby'],
        leagueName: result[0].name
      }

      console.log('RES LOCALS', res.locals)

      res.render('draft-lobby');
    })
  },
  makePick: function(req, res, next){
    var pickerId = req.session.uzer_id;
    var draftId = parseInt(req.params.draftId);
    var drafteeName = req.body.name;

    var currentDraftKey = 'draft' + req.params.draftId;
    var round = req.session[currentDraftKey];

    if(!req.session[currentDraftKey]){
      round = 1;
    }

    req.models.draftee.find({ name: drafteeName, draft_id: draftId }, 
      function(err, currentDraftee){
        if(err){
          console.error(err);
        }

// This is cached from restricted routes usage so async is not necessary
        var overallPick = req.models.draft.get(draftId, function(err, currentDraft){
          return currentDraft.calculateCurrentSelectionNumber(pickerId, round);
        })

        req.session[currentDraftKey]++;

        currentDraftee[0].save({ available: false, draft_id: draftId,
          picker_id: pickerId, overallPick: overallPick }, function(err){
            if(err){
              console.error(err);
            }
            res.end(currentDraftee[0]);
        });
    });
  }
};