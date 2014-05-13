exports.snakeOrderHandling = function(pickerSpot, round){
  if(round % 2){
    return pickerSpot + 1;
  }else{
    return pickerSpot - 1;
  }
};

exports.isLastPickOfDraft = function(overallPick, rounds, numPlayers){
  if(overallPick === rounds * numPlayers){
    return true
  }
  return false;
}

exports.calculateOverallPickNumber = function (order, round, picker){
  var orderArray = order.split('-');
  var pickWithinRound = parseInt(orderArray.indexOf(picker.toString()));
  var numberOfLeagueMembers = orderArray.length;

  var runningTotal = numberOfLeagueMembers * (round - 1);

// we are assuming snake style drafting
  if(round % 2){
    runningTotal = runningTotal + pickWithinRound + 1;
  }else{
    runningTotal = runningTotal + (numberOfLeagueMembers - pickWithinRound);
  }

  return runningTotal;
}