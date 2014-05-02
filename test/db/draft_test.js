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

  console.log('~~~~~~~~~~~~~DB TESTS~~~~~~~~~~~~~~~~');

  describe('Saving draft to db', function(){
    it('should only save with draft time in future', function(done){
      var pastStartTime = new Date(Date.now() - 1 );
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
      Draft.create(validProperties, function(err){
        expect(err).to.not.exist;

        Draft.find(validProperties, function(err, results){
          expect(results[0].league_id).to.equal(validProperties.league_id);
          expect(results.length).to.equal(1);
          done();
        });
      });
    });
  });
});