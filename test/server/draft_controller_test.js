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
    it('Should be accessible by league creator', function(done){
      helper.logInWithLeagueCreator()
        .get('/league/1/draft')
        .expect(200).end(done);
    });

    it('Should not be accessible by league member', function(done){
      helper.logInWithLeagueMember()
        .get('/league/1/draft')
        .expect(500).end(done);
    });
  });
  
  describe('#create', function(){
    var newDraftStub;
    var validArgs = { start_time: 1497758400000 };

    beforeEach(function(){
      newDraftStub = sinon.stub(models.draft, 'create')
        .callsArgWith(1, null, 'draft dummy');    
    });
    afterEach(function(){
      models.draft.create.restore();
    })

    it('Should be accessible by league creator', function(done){
      helper.logInWithLeagueCreator()
        .post('/league/1/draft')
        .form( {start_time: '1497758400000'} )
        .expect(200).end(done);
    });

    it('Should not be accessible by league member', function(done){
      helper.logInWithLeagueMember()
        .post('/league/1/draft')
        .form({ start_time: '1497758400000' })
        .expect(500).end(done);
    });

    it('should call create draft method', function(done){
      helper.logInWithLeagueCreator()
        .post('/league/1/draft')
        .form(validArgs)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }
          expect(newDraftStub.calledWith(validArgs)).to.equal(true);

          done();
        });
    });
  });

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