module.exports = function(req, res) {
  res.render('index.ejs', {hello_world: 'hiiiii world', title: 'index'});
};