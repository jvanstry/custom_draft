var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('supertest');

describe('Routing', function(){
  describe('GET /', function(){
    it('respond with plain text', function(done){
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done)
        })
    });
  });
  
  describe('POST /', function(){
    it('should log you in with proper credentials', function(done){

    });

    it('should redirect you to home page without', function(done){

    });
  });

  describe('DELETE /', function(){
    it('should log you out', function(done){

    });

    it('should redirect you to home page', function(done){

    });
  });
});