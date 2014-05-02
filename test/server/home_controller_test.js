var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('supertest');

describe('Home Controller', function(){
  describe('#get', function(){
    it('should respond with plain text', function(done){
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done).end(function(err, res){
          expect(err).to.not.exist;
          // console.log(res);
          done();
        })
    });
  });
  
  describe('#signIn', function(){
    // it('should log you in with proper credentials', function(done){

    // });

    // it('should redirect you to home page without', function(done){

    // });
  });

  describe('#signOut', function(){
    // it('should log you out', function(done){

    // });

    // it('should redirect you to home page', function(done){

    // });
  });
});

