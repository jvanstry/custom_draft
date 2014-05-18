var helper = require('../test-helper');
var Draft;
var validProperties = { start_time: new Date(1497758400000), league_id: 14 };
/*jshint expr: true*/

function referenceDraft(){
  Draft = models.draft;
}

describe('Draft class', function(){
  beforeEach(helper.dbSetup);
  beforeEach(helper.modelSetup);
  beforeEach(referenceDraft);
  afterEach(helper.dbCleanup);

  describe('Saving draft to db', function(){
    it('should only save with draft time in future', function(done){
      var pastStartTime = new Date(Date.now() - 10000 );
      var invalidProperties = { start_time: pastStartTime, league_id: 14 };

      Draft.create(invalidProperties, function(err, results){
        expect(err).to.exist;
        
        Draft.find(pastStartTime, function(err, results){
          expect(results).to.be.empty;
          done();
        }); 
      });
    });

    it('should not save without a league_id', function(done){
      var noLeagueID = omit(validProperties, 'league_id');

      Draft.create(noLeagueID, function(err, results){
        expect(err).to.exist;
        
        Draft.find(noLeagueID, function(err, results){
          expect(results).to.be.empty;
          done();
        }); 
      });
    });

    it('should save with valid properties', function(done){
      Draft.create(validProperties, function(err, result){
        expect(err).to.not.exist;
        expect(result.league_id).to.equal(14);
        done();
      });
    });
  });

  describe('#calculateOverallPickNumber', function(){
    var draftOrder = '1-2-3-4-5';
    var pickerId = 4;

    it('should calculate overall pick number properly', function(done){
      var round = 1;

      var pickNum = Draft.calculateOverallPickNumber(draftOrder, round, pickerId);
      expect(pickNum).to.equal(4);
      done();
    });

    it('should deal with snake ordering', function(done){
      var round = 2;

      var pickNum = Draft.calculateOverallPickNumber(draftOrder, round, pickerId);
      expect(pickNum).to.equal(7);
      done();
    });
  });

  describe('#updateActivePicker', function(){
    beforeEach(helper.seed);

    it('should update draft active picker in DB', function(done){
      Draft.updateActivePicker(1, 1, 2, '2-1', function(err, activePickerId){
        Draft.get(1, function(err, result){
          expect(result.active_picker_id).to.equal(1);
          done();
        });
      });
    });

    it('should call callback with active picker id', function(done){
      Draft.updateActivePicker(1, 1, 2, '2-1', function(err, activePickerId){
        expect(activePickerId).to.equal(1);
        done();
      });
    });

    it('should return boolean true if draft is over', function(done){
      Draft.updateActivePicker(1, 4, 2, '2-1', function(err, activePickerId){
        expect(typeof(activePickerId)).to.equal('boolean');
        done();
      });
    });
  });

  describe('draft#startDraft', function(){
    var draft;
    var arrayRandomizer = require('../../models/helpers/shuffle-array');
    var draftSaveStub;

    var arrayRandomizerStub = sinon.stub(module.children[0], 'exports')
      .returns([2, 1]);

    beforeEach(function(done){
      Draft.create(validProperties, function(err, result){
        if(err){
          console.error(err);
        }

        draft = result;
        draftSaveStub = sinon.stub(draft, 'save')
          .callsArgWith(0, null)

        done();
      });
    });

    afterEach(function(){
      draft.save.restore();
      arrayRandomizerStub.restore();
    });

    it('should call the helper method for array randomization', function(){
      draft.startDraft(['1', '2'], function(){});

      expect(arrayRandomizerStub.called).to.equal(true);

    });

    it('should call callback with newly randomized order', function(){
      var spy = sinon.spy();

      draft.startDraft(['1', '2'], spy)
      expect(spy.calledWith(null, [2, 1])).to.equal(true);
    });

    it('should save new random order to DB', function(){
      draft.startDraft(['1', '2'], function(){});

      expect(draftSaveStub.called).to.equal(true);
    });
  });
});











