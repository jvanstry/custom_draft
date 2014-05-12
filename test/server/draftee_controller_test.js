var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('super-request');

describe('Draftee Controller', function(){
  var leagueId = 1;
  var drafteeName = 'jerbear';

  before(helper.dbSetup);
  before(helper.modelSetup);
  before(helper.seed);
  after(helper.dbCleanup);

  describe('#create', function(){
    var createDrafteeRoute = '/draftee/' + leagueId;

    it('Should be accessible by league creator', function(done){
      helper.logInWithLeagueCreator()
        .post(createDrafteeRoute)
        .form({ name: drafteeName })
        .expect(200).end(done);
    });

    it('Should not be accessible by simple league member', function(done){
      helper.logInWithLeagueMember()
        .post(createDrafteeRoute)
        .form({ name: drafteeName })
        .expect(500).end(done);
    });
  });
});