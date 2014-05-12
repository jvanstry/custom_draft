module.exports = {
  create: function(req, res, next){
    var leagueId = parseInt(req.params.leagueId);
    var name = req.body.name;

    req.models.league.get(leagueId, function(err, result){
      if(err){
        console.error(err);
      }

      var draftId = result.draft.id;
      
      req.models.draftee.create({ name: name, draft_id: draftId },
        function(err, result){
          if(err){
            console.error(err);
          }

          var nameInDb = result.name;
          res.end(nameInDb);
        });
    });
  }
};