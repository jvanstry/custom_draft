var helper = require('../test-helper');
var Room;
var validProperties = { draft_id: 1 };
/*jshint expr: true*/

function referenceRoom(){
  Room = models.room;
}

describe('Room class', function(){
  beforeEach(helper.dbSetup);
  beforeEach(helper.modelSetup);
  beforeEach(referenceRoom);
  afterEach(helper.dbCleanup);

  describe('Saving Room to db', function(){
    it('should save with valid properties', function(done){
      Room.create(validProperties, function(err){
        expect(err).to.not.exist;

        Room.find(validProperties, function(err, results){
          expect(results.length).to.equal(1);
          done();
        });
      });
    });
  });
});