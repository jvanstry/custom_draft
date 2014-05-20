module.exports= { 
  setupSocket: function(req, res, next){
    var uzerId = req.session.uzer_id;
    uzerId = 1;
    //todo get this out
    if(!uzerId){
      return next();
    }

    var leagueId = parseInt(req.params.leagueId);

    req.models.league.get(leagueId, function(err, result){
      if(err){
        console.error(err)
      }

      console.log(result);
      next();
    });




  }
}