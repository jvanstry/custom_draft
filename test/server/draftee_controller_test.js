var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('super-request');

describe('Draftee Controller', function(){
  var leagueId = 1;
  var drafteeName = 'jerbear';
  var drafteeCreateStub;
  var draftId = 1;
  var validArgs = { name: drafteeName, draft_id: draftId };

  before(helper.dbSetup);
  before(helper.modelSetup);
  before(helper.seed);
  after(helper.dbCleanup);

  beforeEach(function(){
    drafteeCreateStub = sinon.stub(models.draftee, 'create')
      .callsArgWith(1, null, { name: drafteeName });

    leagueGetStub = sinon.stub(models.league, 'get')
      .callsArgWith(1, null, {draft: { id: draftId } }); 
  });

  afterEach(function(){
    models.draftee.create.restore();

    models.league.get.restore();
  });

  describe('#create', function(){
    var createDrafteeRoute = '/draftee/' + leagueId;

    it('Should be accessible by league creator', function(done){
      helper.logInWithLeagueCreator()
        .post(createDrafteeRoute)
        .form(omit(validArgs, 'draft_id'))
        .expect(200).end(done);
    });

    it('Should not be accessible by simple league member', function(done){
      helper.logInWithLeagueMember()
        .post(createDrafteeRoute)
        .form(omit(validArgs, 'draft_id'))
        .expect(500).end(done);
    });

    it('Should call draftee create method', function(done){
      helper.logInWithLeagueCreator()
        .post(createDrafteeRoute)
        .form(omit(validArgs, 'draft_id'))
        .expect(200).end(function(err, res){
          expect(drafteeCreateStub.calledWith(validArgs)).to.equal(true);
          done();
        }); 
    });
  });
});