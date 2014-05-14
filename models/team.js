function Team(uzer, league){
  this.owner = uzer;
  this.league = league;
  this.members = this.addMembers();
}

Team.prototype.addMembers = function(){
  var draftId = this.league.draft.id;

  function properLeague(draftee){
    return draftee.draftId === draftId;
  }

  return this.owner.draftPicks.filter(properLeague);
}

Team.prototype.calculateTotalScore = function(){
  var teamScore = 0;

  for(var i = 0; i < this.members.length; i++){
    teamScore += this.members[i].score;
  }

  return teamScore;
}


module.exports = Team;