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
    // var pickerId = req.session.uzer_id;
    // var leagueId = req.params.leagueId;

    // var name = req.body.name;

    // req.models.draftee.find({ name: name, draft_id: draftId }, function(err, result){

    // })

    res.end();
  }
};