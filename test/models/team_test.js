var helper = require('../test-helper');
var Team;
/*jshint expr: true*/

function referenceTeam(){
  Team = models.team;
}

describe('Team class', function(){
  beforeEach(helper.dbSetup);
  beforeEach(helper.modelSetup);
  beforeEach(referenceTeam);
  afterEach(helper.dbCleanup);

  var leagueMock = { draft: { id: 1 } };
  
  function DrafteeMocker(draftId, score){
    this.draftId = draftId;
    this.score = score;
  }

  it('should grab proper members upon initialization', function(){
    var mockDraftPicks = [ new DrafteeMocker(1), new DrafteeMocker(1), 
      new DrafteeMocker(2)];
    var ownerMock = { draftPicks: mockDraftPicks };
    var team = new Team(ownerMock, leagueMock);

    expect(team.members.length).to.equal(2);
  });

  it('should calculate proper score for team', function(){
    var mockDraftPicks = [ new DrafteeMocker(1, 50), new DrafteeMocker(1, 25), 
      new DrafteeMocker(1, 25)];
    var ownerMock = { draftPicks: mockDraftPicks };
    var team = new Team(ownerMock, leagueMock);
    var score = team.calculateTotalScore();

    expect(score).to.equal(100);
  });
});