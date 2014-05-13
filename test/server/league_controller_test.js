var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('super-request');

describe('League Controller', function(){
  var leagueName = 'cool league'
  var leagueCreateStub;
  var validArgs = { name: leagueName };
  var uzerId = 1;
  var preCreatedLeagueId = 1;

  before(helper.dbSetup);
  before(helper.modelSetup);
  before(helper.seed);
  after(helper.dbCleanup);

  beforeEach(function(){
    leagueCreateStub = sinon.stub(models.league, 'create')
      .callsArgWith(1, null, { name: leagueName });

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
  });

  describe('#create', function(){
    var createLeagueRoute = '/league';

    it('Should be accessible by logged in uzer', function(done){
      helper.logInWithSimpleUzer()
        .post(createLeagueRoute)
        .form(validArgs)
        .expect(200).end(done);
    });

    it('Should not be accessible by rando', function(done){
      request(app)
        .post(createLeagueRoute)
        .form(validArgs)
        .expect(500).end(done);
    });
  });

  describe('#get', function(){
    var getLeagueRoute = '/league/' + preCreatedLeagueId;

    it('Should be accessible by rando', function(done){
      request(app)
        .get(getLeagueRoute)
        .expect(200).end(done);
    });
  });

  describe('#index', function(){
    var indexLeaguesRoute = '/leagues';

    it('Should be accessible by rando', function(done){
      request(app)
        .get(indexLeaguesRoute)
        .expect(200).end(done);
    });
  });
});