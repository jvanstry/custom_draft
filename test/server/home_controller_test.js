var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('supertest');

describe('Home Controller', function(){
  describe('#get', function(){
    it('should respond with plain text', function(done){
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200).end(function(err, res){
          expect(err).to.not.exist;
          done();
        })
    });
  });
  
  describe('#signIn', function(){
    beforeEach(helper.modelSetup);

    it('should log you in with proper credentials', function(done){
      var validLogin = { email: 'valid', password: 'also_valid' };

      var authStub = sinon.stub(models.uzer, 'authenticate')
        .withArgs(validLogin.email, validLogin.password)
        .callsArgWith(2, { email: 'valid', error: false });

      request(app)
        .post('/')
        .send(validLogin)
        .expect(200).end(function(err, res){
          expect(err).to.not.exist;

          var parsed = JSON.parse(res.text);
          expect(parsed.email).to.equal('valid');
          console.log(res.header);

          models.uzer.authenticate.restore();
          done();
        })
    });

    it('should not log you in with invalid creds', function(done){
      var invalidLogin = { email: 'valid', password: 'invalid' };

      var authStub = sinon.stub(models.uzer, 'authenticate')
        .withArgs(invalidLogin.email, invalidLogin.password)
        .callsArgWith(2, { email: 'valid', error: true });

      request(app)
        .post('/')
        .send(invalidLogin)
        .expect(200).end(function(err, res){
          expect(err).to.not.exist;

          var parsed = JSON.parse(res.text);
          expect(parsed.error).to.equal('invalid credentials');

          models.uzer.authenticate.restore();
          done();
        })
    });
  });

  describe('#signOut', function(){
    // it('should log you out', function(done){

    // });

    // it('should redirect you to home page', function(done){

    // });
  });
});

