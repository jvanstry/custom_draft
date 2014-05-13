module.exports = {
  new: function(req, res, next){
    res.locals = {
      title: 'Create New League',
      styles: ['new-league']
    };
    res.render('new-league');
  },
  create: function(req, res, next){
    var uzerId = req.session.uzer_id;
    var name = req.body.name;

    req.models.league.create({ name: name }, function(err, result){
      if(err){
        console.err(err)
      }

      var leagueHomePageUrl = 'league/' + result.id;
      res.redirect(leagueHomePageUrl);
    });
  },
  get: function(req, res, next){
    var leagueId = parseInt(req.params.leagueId);

    req.models.league.find({ id: leagueId }, function(err, result){
      if(err){
        console.err(err)
      }

      var leagueName = result[0].name;
      var pageTitle = leagueName + ' home';

      res.locals = {
        title: pageTitle,
        styles: ['league']
      };

      res.render('league');
    })
  },
  index: function(req, res, next){
    req.models.league.find({}, 15, function(err, result){
      if(err){
        console.err(err)
      }

      var leagueName = result[0].name;

      res.locals = {
        title: 'Recent Leagues',
        styles: ['leagues']
      };

      res.render('leagues');
    })
  }
};