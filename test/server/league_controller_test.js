var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('super-request');

describe('League Controller', function(){
  var leagueName = 'cool league'
  var leagueCreateStub;
  var validArgs = { name: leagueName };
  var uzerId = 1;
  var preCreatedLeagueId = 1;
  var newlyCreateLeagueId = 2;
  var preExistingLeagueName = 'jerbear league';

  beforeEach(helper.dbSetup);
  beforeEach(helper.modelSetup);
  beforeEach(helper.seed);
  afterEach(helper.dbCleanup);

  beforeEach(function(){
    leagueCreateStub = sinon.stub(models.league, 'create')
      .callsArgWith(1, null, { name: leagueName, id: newlyCreateLeagueId });

  });

  afterEach(function(){
    models.league.create.restore();
  });

  describe('#new', function(){
    var newLeagueRoute = '/league';

    it('Should be accessible by logged in uzer', function(done){
      helper.logInWithSimpleUzer()
        .get(newLeagueRoute)
        .expect(200).end(done);
    });

    it('Should not be accessible by rando', function(done){
      request(app)
        .get(newLeagueRoute)
        .expect(500).end(done);
    });

    it('Should render the new view creation page', function(done){
      helper.logInWithSimpleUzer()
        .get(newLeagueRoute)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.body).to.contain('form');
          done();
        })     
    });
  });

  describe('#create', function(){
    var createLeagueRoute = '/league';

    it('Should be accessible by logged in uzer', function(done){
      helper.logInWithSimpleUzer()
        .post(createLeagueRoute)
        .form(validArgs)
        .expect(302).end(done);
    });

    it('Should not be accessible by rando', function(done){
      request(app)
        .post(createLeagueRoute)
        .form(validArgs)
        .expect(500).end(done);
    });

    it('Should call the create league function', function(done){
      helper.logInWithSimpleUzer()
        .post(createLeagueRoute)
        .form(validArgs)
        .expect(302).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(leagueCreateStub.calledWith(validArgs)).to.equal(true);
          done();
        });
    });

    it('Should redirect to the league home page', function(done){
      helper.logInWithSimpleUzer()
        .post(createLeagueRoute)
        .form(validArgs)
        .expect(302).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.headers['location']).to.contain('league/' + newlyCreateLeagueId);
          done();
        });
    });
  });

  describe('#get', function(){
    var getLeagueRoute = '/league/' + preCreatedLeagueId;
    var validFindArgs = { id: preCreatedLeagueId };

    beforeEach(function(){
      leagueFindStub = sinon.stub(models.league, 'find')
        .callsArgWith(1, null, [{ name: preExistingLeagueName }]);    
    });

    afterEach(function(){
      models.league.find.restore();
    });

    it('Should be accessible by rando', function(done){
      request(app)
        .get(getLeagueRoute)
        .expect(200).end(done);
    });

    it('Should call the league find method', function(done){
      request(app)
        .get(getLeagueRoute)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(leagueFindStub.calledWith(validFindArgs)).to.equal(true);
          done();
        });      
    });

    it('Should render league homepage view', function(done){
      request(app)
        .get(getLeagueRoute)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.body).to.contain(preExistingLeagueName);
          done();
        }); 
    });
  });

  describe('#index', function(){
    var indexLeaguesRoute = '/leagues';
    var leagueFindAllStub;

    beforeEach(function(){
      leagueFindAllStub = sinon.stub(models.league, 'find')
        .callsArgWith(2, null, [{ name: preExistingLeagueName }]);    
    });

    afterEach(function(){
      models.league.find.restore();
    });

    it('Should be accessible by rando', function(done){
      request(app)
        .get(indexLeaguesRoute)
        .expect(200).end(done);
    });

    it('Should call the league find method with no filter', function(done){
      request(app)
        .get(indexLeaguesRoute)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(leagueFindAllStub.calledWith({})).to.equal(true);
          done();
        });       
    });

    it('Should render the view index page', function(done){
      request(app)
        .get(indexLeaguesRoute)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.body).to.contain('Recent Leagues');
          done();
        }); 
    });
  });
});