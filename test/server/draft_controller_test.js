var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('super-request');

describe('Draft Controller', function(){
  before(helper.dbCleanup);
  before(helper.dbSetup);
  before(helper.modelSetup);
  before(helper.seed);
  after(helper.dbCleanup);

  describe('#new', function(){

    beforeEach(function(done){
      request(app)
        .post('/')
        .form({ email: 'jer@example.com', password: 'notSecurezYet' })
        .expect(200).end(function(err, res){
          done();
        });
    });

    it('should respond with proper locals', function(done){
      request(app)
        .post('/')
        .form({ email: 'jer@example.com', password: 'notSecurezYet' })
        .expect(200)
        .end()
        .get('/league/1/draft')
        .expect(200).end(done);
    });
  });
  
  // describe('#create', function(){
  //   it('should log you in with proper credentials', function(done){

  //   });

  //   it('should not log you in with invalid creds', function(done){

  //   });
  // });

  // describe('#getLobby', function(){
  //   it('should log you out', function(done){
  //     request(app)
  //       .del('/')
  //       .expect(200).end(done);
  //   });
  // });

  // describe('#makePick', function(){
  //   it('should log you out', function(done){
  //     request(app)
  //       .del('/')
  //       .expect(200).end(done);
  //   });
  // });
});