var helper = require('../test-helper');
var Draft;
var validProperties = { start_time: new Date(1497758400000), league_id: 14 }

function referenceDraft(){
  Draft = models.draft;
};

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
      var noLeagueID = omit(validProperties, 'league_id')

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
  })
});