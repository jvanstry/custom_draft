var helper = require('../test-helper');
var Draftee;
var validProperties = { name: 'jerry', draft_id: 1 };
/*jshint expr: true*/

function referenceDraftee(){
  Draftee = models.draftee;
}

describe('Draftee class', function(){
  beforeEach(helper.dbSetup);
  beforeEach(helper.modelSetup);
  beforeEach(referenceDraftee);
  afterEach(helper.dbCleanup);

  describe('Saving draftee to db', function(){
    it('should not save without a name', function(done){
      var noName = omit(validProperties, 'name');

      Draftee.create(noName, function(err, results){
        expect(err).to.exist;
        
        Draftee.find(noName, function(err, results){
          expect(results).to.be.empty;
          done();
        }); 
      });
    });

    it('should not save without a draft_id', function(done){
      var noDraftID = omit(validProperties, 'draft_id');

      Draftee.create(noDraftID, function(err, results){
        expect(err).to.exist;
        
        Draftee.find(noDraftID, function(err, results){
          expect(results).to.be.empty;
          done();
        }); 
      });
    });

    it('should save with valid properties', function(done){
      Draftee.create(validProperties, function(err){
        expect(err).to.not.exist;

        Draftee.find(validProperties, function(err, results){
          expect(results[0].name).to.equal(validProperties.name);
          expect(results.length).to.equal(1);
          done();
        });
      });
    });
  });
});