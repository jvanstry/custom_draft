var socket = require('../models/socket');

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
        console.error(err);
      }

      res.locals = {
        leagueId: leagueId,
        title: result[0].league.name + ' draft lobby',
        styles: ['draft-lobby'],
        leagueName: result[0].name
      };

      res.render('draft-lobby');
    });
  },
  draftJSON: function(req, res, next){
    var leagueId = parseInt(req.params.leagueId);
    // var uzerId = req.session.uzer_id;
    var uzerId = 1;
    // todo figure out how to test this prob if(process.env.NOD..etc.)

    var draftData = {};
    req.models.draft.find({ league_id: leagueId }, function(err, result){
      if(err){
        console.error(err);
      }

      var draft = result[0];

      draft.league.getMembers(function(err, members){
        var draftData = {};

        if(draft.order){
          draftData.order = draft.order.split('-');
        }

        draftData.startTime = draft.start_time;
        draftData.draftId = draft.id;
        draftData.leagueMembers = members;
        draftData.draftees = draft.draftees;
        draftData.clientId = uzerId;
        draftData.activePickerId = draft.active_picker_id;

        var str = JSON.stringify(draftData);
        res.end(str);
      });
    });
  },
  establishSocket: function(req, res, next){
    var leagueId = parseInt(req.params.leagueId);
    var membersIds = req.body.members;
    // var uzerId = req.session.uzer_id;
    var uzerId = 1;
    console.log('here 82')
    req.models.draft.find({ league_id: leagueId }, function(err, result){
      if(err){
        console.error(err);
      }
      console.log('here in func 87')

      var draft = result[0];
      socket(draft, uzerId, function(socket_id){
        res.end(socket_id)
      });
    });
  },
  startDraft: function(req, res, next){
    var leagueId = parseInt(req.params.leagueId);
    var membersIds = req.body.members;

    req.models.draft.find({ league_id: leagueId }, function(err, result){
      if(err){
        console.error(err);
      }

      var draft = result[0];

      draft.startDraft(membersIds, function(err, order){
        if(err){
          console.error(err);
        }

        var strOrder = JSON.stringify(order);
        //todo: broadcast order to all sockets
        res.end(strOrder);      
      });
    });
  },
  makePick: function(req, res, next){
    // wow this is massive.... think about doing SOMETHING (child process?)
    var pickerId = req.session.uzer_id;
    // var pickerId = 1;
    // for dev purposes here
    
    var draftId = parseInt(req.params.draftId);
    var drafteeName = req.body.name;

    var orderSessionKey = 'draft' + draftId + 'order';
    var draftOrder = req.session[orderSessionKey];

    draftOrder = '2-1';

    req.models.draft.calculateOverallPickNumber(draftId, function(overallPick){
      req.models.draftee.find({ name: drafteeName, draft_id: draftId }, 
        function(err, currentDraftee){
          if(err){
            console.error(err);
          }

          currentDraftee[0].save({ available: false, picker_id: pickerId,
            overallPick: overallPick }, function(err){
              if(err){
                console.error(err);
              }

              req.models.draft.updateActivePicker(draftId, overallPick, pickerId, draftOrder, 
                function(err, activePickerId){
                if(err){
                  console.error(err);
                }else if(typeof(activePickerId) === 'number'){

                  var fun = 'overallpick' + currentDraftee[0].overallPick;
                  res.end(fun);
                }else{
                  // draft is over
                  res.end('draft over');
                }
              });
          });
      });
    });
  }
};