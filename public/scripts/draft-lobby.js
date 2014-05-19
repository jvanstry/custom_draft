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
});

draftLobbyApp.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

draftLobbyApp.service('mapIdsToMemberNames', function(){
  return function(members){
    var mappingObj = { numMembers: members.length };

    members.forEach(function(member){
      mappingObj[member.id] = member.name;
    });

    return mappingObj;
  }
});

draftLobbyApp.service('draftOrder', function(){
  return function(idToNameMap, orderArr){
    if(idToNameMap && angular.isArray(orderArr)){
      var orderSortedNames = [];

      orderArr.forEach(function(el, i, arr){
        var orderInt = parseInt(el);
        orderSortedNames.push({ name: idToNameMap[orderInt] })
      });

      return orderSortedNames;
    }
  }
});

draftLobbyApp.service('isCreator', function(){
  return function(leagueMembers, clientId){
    var uzer = leagueMembers.filter(function(member){
      return member.id === clientId;
    });

    var isCreator = false;

    if(uzer.length){
      isCreator = uzer[0].isCreator;
    }

    return isCreator;
  }
});

draftLobbyApp.controller('draftController', function(formatHistory, isCreator, 
  mapIdsToMemberNames, draftOrder, socket, $http, $window, $scope) {

  // $scope.availableDraftees = [];
  $scope.results = [];

  $scope.leagueId = $window.location.pathname.substring(7);

  var url = '/draft-info/' + $scope.leagueId;

  $http.get(url)
    .success(function(data) {
      $scope.draftData = data;
      $scope.idToNameMap = mapIdsToMemberNames($scope.draftData.leagueMembers);

      $scope.isCreator = isCreator($scope.draftData.leagueMembers, 
        $scope.draftData.clientId);

      $scope.timeToDraft = new Date($scope.draftData.startTime) < new Date();
      // Todo: investigate if this needs a "watch" function

      if($scope.draftData.order){
        $scope.orderSortedNames = draftOrder($scope.idToNameMap, $scope.draftData.order);
      }

      console.log($scope.draftData);

      $scope.createHistory();
  });

  $scope.startDraft = function(){
    var url = '/start-draft/' + $scope.leagueId;
    var memberIds =[];
    $scope.draftData.leagueMembers.forEach(function(member){
      memberIds.push(member.id);
    });

    $http.post(url, memberIds)
      .success(function(data){
        $scope.draftData.order = data;
        $scope.orderSortedNames = draftOrder($scope.idToNameMap, 
          $scope.draftData.order);
    });
  };

  $scope.updateActivePicker = function(){

  };

  $scope.createHistory = function(){
    var takenDraftees = $scope.draftData.draftees.filter(function(draftee){
      return !draftee.available;
    });


    $scope.formattedHistory = formatHistory(takenDraftees, $scope.idToNameMap);
  };

  $scope.updateHistory = function(){

  };


});

draftLobbyApp.controller('chatController', function(socket, $scope){
  socket.on('message', function (data) {

    console.log(data, 'client on message');
  });

  socket.on('pick-made', function(data){

  });

  $scope.sendMessage = function(){
    var name = $scope.idToNameMap[$scope.draftData.clientId];

    socket.emit('message', { message: $scope.message, name: name });
  }

  $scope.makePick = function(){
    // post to draft/:draftId
    // form data is draftee name
    // include clientId why not?
  }

});

draftLobbyApp.controller('pickController', function($http, $scope){
  $scope.makePick = function(){

    var url = '/draft/' + $scope.draftData.draftId;
    var drafteeName = $scope.draftData.currentPick;

    $http.post(url, { name: drafteeName })
      .success(function(data){
        console.log(data);
    });
  }

});



