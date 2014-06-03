var helper = require('../test-helper');
var League;
var validProperties = { name: 'jerry_league' };
/*jshint expr: true*/

function referenceLeague(){
  League = models.league;
}

describe('League class', function(){
  beforeEach(helper.dbSetup);
  beforeEach(helper.modelSetup);
  beforeEach(referenceLeague);
  afterEach(helper.dbCleanup);

  describe('Saving league to db', function(){
    it('should not save without a name', function(done){
      var noName = omit(validProperties, 'name');

      League.create(noName, function(err, results){
        expect(err).to.exist;
        
        League.find(noName, function(err, results){
          expect(results).to.be.empty;
          done();
        }); 
      });
    });

    it('should save with valid properties', function(done){
      League.create(validProperties, function(err){
        expect(err).to.not.exist;

        League.find(validProperties, function(err, results){
          expect(results[0].name).to.equal(validProperties.name);
          expect(results.length).to.equal(1);
          done();
        });
      });
    });

    it('should generate an access code', function(done){
      League.create(validProperties, function(err){
        expect(err).to.not.exist;

        League.find(validProperties, function(err, results){
          expect(results[0].accessCode).to.exist;
          done();
        });
      });
    });
  });
});