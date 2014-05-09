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