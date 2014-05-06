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

    req.models.draft.create({ start_time: startTime }, function(err, result){
      if(err){
        console.error(err);
      }

      res.end('hi');
    });
 
  },
  getLobby: function(req, res, next){

  },
  makePick: function(req, res, next){
    res.send('yessss');
  }
};