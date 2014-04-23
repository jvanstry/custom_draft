module.exports = function(req, res) {
  res.render('index.ejs', {hello_world: 'hello world'})
}