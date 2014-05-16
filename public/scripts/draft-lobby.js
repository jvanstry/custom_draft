var draftLobbyApp = angular.module('draftLobbyApp', []);

draftLobbyApp.service('formatHistory', function(){
  return function(takenDraftees, idToNameMap){
    // unsure how much actual performance advantage we get by utilizing the 
    //  singleton nature of services here but it's fun to optimize as much
    //  as possible and gain some practice with using singleton pattern

    var formattedArray = formattedArray || [];
    var numberOfPickers = idToNameMap.numMembers;
    
    var inNeedOfFormatting = takenDraftees.length - formattedArray.length;

    for(var i = inNeedOfFormatting; i > 0; i--){
      var formattedDraftee = {};
      var index = takenDraftees.length - i;
      var draftee = takenDraftees[index];

      formattedDraftee.round = Math.floor(draftee.overallPick / numberOfPickers) + 1;
      formattedDraftee.pickInRound = draftee.overallPick % numberOfPickers;
      formattedDraftee.pickerName = idToNameMap[draftee.picker_id];
      formattedDraftee.name = draftee.name;

      formattedArray.push(formattedDraftee);
    }

    return formattedArray;
  }
})

draftLobbyApp.service('mapIdsToMemberNames', function(){
  return function(members){
    var mappingObj = { numMembers: members.length };

    members.forEach(function(member){
      mappingObj[member.id] = member.name;
    });

    return mappingObj;
  }
})

var controller = draftLobbyApp
  .controller('draftController', function(formatHistory, 
    mapIdsToMemberNames, $http, $window, $scope) {

    // $scope.availableDraftees = [];
    $scope.results = [];

    $scope.leagueId = $window.location.pathname.substring(7);

    var url = '/draft-info/' + $scope.leagueId;

    $http.get(url)
      .success(function(data) {
        $scope.draftData = data;
        $scope.idToNameMap = mapIdsToMemberNames($scope.draftData.leagueMembers);

        console.log($scope.draftData);

        $scope.createHistory();
    });



    $scope.createHistory = function(){
      var takenDraftees = $scope.draftData.draftees.filter(function(draftee){
        return !draftee.available;
      });


      $scope.formattedHistory = formatHistory(takenDraftees, $scope.idToNameMap);
      console.log($scope.formattedHistory);
    };

    $scope.updateHistory = function(){

    };


  });

