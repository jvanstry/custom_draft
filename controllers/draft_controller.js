module.exports = {
  new: function(req, res, next){
    res.locals = {
      title: 'New Draft',
      styles: ['new-draft']
    }
    res.render('new-draft');
  },
  create: function(req, res, next){

  },
  getLobby: function(req, res, next){

  },
  makePick: function(req, res, next){
    res.send('yessss');
  }
};