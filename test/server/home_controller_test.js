var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('supertest');

describe('Home Controller', function(){
  before(helper.dbSetup);
  before(helper.modelSetup);
  after(helper.dbCleanup);

  describe('#get', function(){
    it('should respond with plain text', function(done){
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200).end(done);
    });
  });
  
  describe('#signIn', function(){
    it('should log you in with proper credentials', function(done){
      var validLogin = { email: 'valid', password: 'also_valid' };

      var authStub = sinon.stub(models.uzer, 'authenticate')
        .withArgs(validLogin.email, validLogin.password)
        .callsArgWith(2, { email: 'valid', error: false, id: 14 });

      request(app)
        .post('/')
        .send(validLogin)
        .expect(200).end(function(err, res){
          expect(err).to.not.exist;

          var parsed = JSON.parse(res.text);
          expect(parsed.email).to.equal('valid');

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
        .expect(401).end(function(err, res){
          expect(err).to.not.exist;

          var parsed = JSON.parse(res.text);
          expect(parsed.error).to.equal('invalid credentials');

          models.uzer.authenticate.restore();
          done();
        })
    });
  });

  describe('#signOut', function(){
    it('should log you out', function(done){
      request(app)
        .del('/')
        .expect(200).end(done);
    });
  });
});

