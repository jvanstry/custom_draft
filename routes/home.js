module.exports = function(req, res) {
  res.render('home.ejs', {hello_world: 'hiiiii world', title: 'home'});
};