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

      res.render('draft-lobby');
    })
  },
  makePick: function(req, res, next){
  // wow this is massive.... think about doing SOMETHING (child process?)
    var pickerId = req.session.uzer_id;
    var draftId = parseInt(req.params.draftId);
    var drafteeName = req.body.name;

    var orderSessionKey = 'draft' + draftId + 'order';
    var draftOrder = req.session[orderSessionKey];

    var roundSessionKey = 'draft' + req.params.draftId + 'round';
    var round = req.session[roundSessionKey] || 1;

    req.models.draftee.find({ name: drafteeName, draft_id: draftId }, 
      function(err, currentDraftee){
        if(err){
          console.error(err);
        }

  //should calcpick be an instance method? shouldn't really be on draftee
  //and is it really worth grabbing draft instance just to run it from there

        var overallPick = calculatePickNumber(draftOrder, round, pickerId);

        round++;
        req.session[roundSessionKey] = round;

        currentDraftee[0].save({ available: false, picker_id: pickerId,
          overallPick: overallPick }, function(err){
            if(err){
              console.error(err);
            }

            req.models.draft.updateActivePicker(draftId, overallPick, pickerId, draftOrder, function(err, activePickerId){
              var activePickerSessionKey = 'draft' + draftId + 'active';

              if(err){
                console.error(err)
              }else if(typeof(activePickerId) === 'number'){
                req.session[activePickerSessionKey] = activePickerId;

                var fun = 'overallpick' + currentDraftee[0].overallPick;
                res.end(fun);
              }else{
                // draft is over
                res.end('draft over');
              };
            });
        });
    });
  }
};

function calculatePickNumber(order, round, picker){
  var orderArray = order.split('-');
  var pickWithinRound = parseInt(orderArray.indexOf(picker.toString()));
  var numberOfLeagueMembers = orderArray.length;

  var runningTotal = numberOfLeagueMembers * (round - 1);

// we are assuming snake style drafting
  if(round % 2){
    runningTotal = runningTotal + pickWithinRound + 1;
  }else{
    runningTotal = runningTotal + (numberOfLeagueMembers - pickWithinRound);
  }

  return runningTotal;
}