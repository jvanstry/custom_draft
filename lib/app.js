var express = require("express");
var http = require("http");
var pg = require("pg");
var app = express();
var logger = require("morgan");
var connString = "postgres://postgres@localhost/custom_draft";

app.set("views", __dirname + "/views");

app.use(logger());

app.all("*", function(request, response, next) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  next();
});

app.get("/", function(request, response) {
  pg.connect(connString, function(err, client, done){
    if(err) response.send("Couldn't connect: " + err);

    client.query('SELECT * FROM users', function(err, result){
      done();
      if(err) return response.end(err);

      response.end(result.rows[0].name)
    })
  })
});

app.get("/about", function(request, response) {
  response.end("Welcome to the about page!");
});

app.get("*", function(request, response) {
  response.end("404!");
});

http.createServer(app).listen(8686, function(){
  console.log('listening on 8686');
});