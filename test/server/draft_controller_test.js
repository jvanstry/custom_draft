var helper = require('../test-helper.js');
var app = require('../../app.js').start();
var request = require('super-request');

describe('Draft Controller', function(){
  var leagueId = 1;
  var leagueName = 'jerbear league';

  before(helper.dbCleanup);
  before(helper.dbSetup);
  before(helper.modelSetup);
  before(helper.seed);
  after(helper.dbCleanup);

  describe('#new', function(){
    var getNewDraftRoute = '/league/' + leagueId + '/draft';

    it('Should be accessible by league creator', function(done){
      helper.logInWithLeagueCreator()
        .get(getNewDraftRoute)
        .expect(200).end(done);
    });

    it('Should not be accessible by league member', function(done){
      helper.logInWithLeagueMember()
        .get(getNewDraftRoute)
        .expect(500).end(done);
    });

    it('Should render create draft view', function(done){
      helper.logInWithLeagueCreator()
        .get(getNewDraftRoute)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.body).to.contain('form');
          done();
        });
    });
  });
  
  describe('#create', function(){
    var newDraftStub, draftFindStub;
    var validArgs = { start_time: 1497758400000, league_id: leagueId };
    var leagueSpecificPostRoute = '/league/' + leagueId + '/draft';

    beforeEach(function(){
      newDraftStub = sinon.stub(models.draft, 'create')
        .callsArgWith(1, null, 'draft dummy');

      draftFindStub = sinon.stub(models.draft, 'find')
        .callsArgWith(1, null, [ { league: {name: leagueName } }]);     
    });

    afterEach(function(){
      models.draft.create.restore();
      models.draft.find.restore();
    });

    it('Should be accessible by league creator', function(done){
      helper.logInWithLeagueCreator()
        .post(leagueSpecificPostRoute)
        .form( {start_time: '1497758400000'} )
        .expect(302).end(done);
    });

    it('Should not be accessible by league member', function(done){
      helper.logInWithLeagueMember()
        .post(leagueSpecificPostRoute)
        .form({ start_time: '1497758400000' })
        .expect(500).end(done);
    });

    it('should call create draft method', function(done){
      helper.logInWithLeagueCreator()
        .post(leagueSpecificPostRoute)
        .form({ start_time: 1497758400000 })
        .expect(302).end(function(err, res){
          if(err){
            return done(err);
          }
          expect(newDraftStub.calledWith(validArgs)).to.equal(true);

          done();
        });
    });

    it('should render the newly created draft view', function(done){
      helper.logInWithLeagueCreator()
        .post(leagueSpecificPostRoute)
        .form({ start_time: 1497758400000 })
        .expect(302).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.headers.location).to.contain('draft/' + leagueId);
          done();
        });
    });
  });

  describe('#getLobby', function(){
    var leagueSpecificGetRoute = '/draft/' + leagueId;
    var draftFindStub;

    beforeEach(function(){
      draftFindStub = sinon.stub(models.draft, 'find')
        .callsArgWith(1, null, [ { league: {name: leagueName } } ]);    
    });

    afterEach(function(){
      models.draft.find.restore();
    });

    it('Should be accessible by anyone', function(done){
      request(app)
        .get(leagueSpecificGetRoute)
        .expect(200).end(done);
    });

    it('Should return the league specific draft lobby', function(done){
      request(app)
        .get(leagueSpecificGetRoute)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.body).to.contain(leagueName);
          done();
        });
    });
  });

  describe('#startDraft', function(){
    var leagueId = 1;
    var startDraftPostRoute = '/start-draft/' + leagueId;
    var draftFindStub;

    beforeEach(function(){
      var findResultMock = [{ 
         startDraft: function(memberIds, cb){
          cb(null, memberIds)
         }
      }];

      draftFindStub = sinon.stub(models.draft, 'find')
        .callsArgWith(1, null, findResultMock);
    });

    afterEach(function(){
      models.draft.find.restore();
    });

    it('Should not be accessible by a random person', function(done){
      request(app)
        .post(startDraftPostRoute)
        .form({ members: [1, 2] })
        .expect(500).end(done);
    });

    it('Should be accessible by league creator', function(done){
      helper.logInWithLeagueCreator()
        .post(startDraftPostRoute)
        .form({ members: [1, 2] })
        .expect(200).end(done);
    });

    it('Should return the league info', function(done){
      helper.logInWithLeagueCreator()
        .post(startDraftPostRoute)
        .form({ members: [1, 2] })
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }

          expect(res.body).to.equal('["1","2"]');
          done();
        });
    });
  });

  describe('#draftJSON', function(){
    var leagueSpecificGetRoute = '/draft-info/' + leagueId;
    var draftFindStub;

    beforeEach(function(){
      var findResultMock = [{ 
        active_picker_id: 1, draftees: ['a draftee'],
        league: {
          getMembers: function(cb){
            cb(null, ['member1', 'member2'])
          }
        }
      }];

      draftFindStub = sinon.stub(models.draft, 'find')
        .callsArgWith(1, null, findResultMock);
    });

    afterEach(function(){
      models.draft.find.restore();
    });

    it('Should be accessible by anyone', function(done){
      request(app)
        .get(leagueSpecificGetRoute)
        .expect(200).end(done);
    });

    it('Should return the league info', function(done){
      // request(app)
      helper.logInWithActivePicker()
        .get(leagueSpecificGetRoute)
        .expect(200).end(function(err, res){
          if(err){
            return done(err);
          }
          var draftData = {
            leagueMembers: ['member1', 'member2'],
            draftees: ['a draftee'],
            clientId: 2,
            activePickerId: 1 
          }

          expect(res.body).to.equal(JSON.stringify(draftData));
          done();
        });
    });
  });

  describe('#makePick', function(){
    var drafteeName = 'jerry';
    var draftId = 1;
    var draftSpecificPostRoute = '/draft/' + draftId;
    var activePickerId = 2;
    var updateActivePickerStub;

    beforeEach(function(){
      updateActivePickerStub = sinon.stub(models.draft, 'updateActivePicker')
        .callsArgWith(4, null, 1);
    });

    afterEach(function(){
      models.draft.updateActivePicker.restore();
    });

    it('Should not be accessible by a rando', function(done){
      request(app)
        .post(draftSpecificPostRoute)
        .form({ name: drafteeName })
        .expect(500).end(done);
    });

    it('Should only be accessible by draft active picker', function(done){
      helper.logInWithActivePicker()
        .post(draftSpecificPostRoute)
        .form({ name: drafteeName })
        .expect(200).end(done);
    });

    it('Should update pickee, and return overall pick num', function(done){
      helper.logInWithActivePicker()
        .post(draftSpecificPostRoute)
        .form({ name: drafteeName })
        .expect(200).end(function(err, res){
          expect(res.body).to.contain('overallpick2');
          done();
        });
    });

    it('Should update the draft active picker', function(done){
      helper.logInWithActivePicker()
        .post(draftSpecificPostRoute)
        .form({ name: drafteeName })
        .expect(200).end(function(err, res){
          expect(updateActivePickerStub.calledWithMatch(draftId, 3, 2, '2-1'))
            .to.equal(true);
          done();
        });
    });
  });
});