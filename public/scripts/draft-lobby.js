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
      var index = takenDraftees.length - i;
      var draftee = takenDraftees[index];

      var formattedDraftee = {
        round: Math.floor(draftee.overallPick / numberOfPickers) + 1,
        pickInRound: draftee.overallPick % numberOfPickers,
        pickerName: idToNameMap[draftee.picker_id],
        name: draftee.name
      };

      if(draftData.pickInRound === 0){
        draftData.pickInRound = numberOfPickers;
      }

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
  mapIdsToMemberNames, draftOrder, $http, $window, $scope) {

  $scope.leagueId = $window.location.pathname.substring(7);
  $scope.getDraftInfo = function(){
    var url = '/draft-info/' + $scope.leagueId;

    $http.get(url)
      .success(function(data) {
        $scope.draftData = data;

        $scope.idToNameMap = mapIdsToMemberNames($scope.draftData.leagueMembers);
        $scope.draftData.name = $scope.idToNameMap[$scope.draftData.clientId];

        $scope.isCreator = isCreator($scope.draftData.leagueMembers, 
          $scope.draftData.clientId);

        $scope.timeToDraft = new Date($scope.draftData.startTime) < new Date();
        // Todo: investigate if this needs a "watch" function

        if($scope.draftData.order){
          $scope.orderSortedNames = draftOrder($scope.idToNameMap, $scope.draftData.order);
        }

        $scope.$broadcast('socket-data', $scope.draftData.socketId);
        $scope.createHistory();
    });
  };

  $scope.getDraftInfo();

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
  $scope.messages = [];


  $scope.$on('socket-data', function(e, socketId){
    socket.emit('join-room', socketId)

    socket.on('message', function (data) {
      data.time = new Date();
      $scope.messages.push(data);
    });
  });

  $scope.sendMessage = function(){
    socket.emit('message', { 
      text: $scope.message, 
      name: $scope.draftData.name,
      socketId: $scope.draftData.socketId 
    });

    $scope.chatForm.$setPristine();
    $scope.message = null;
  }
});

draftLobbyApp.controller('pickController', function($http, socket, $scope){
  $scope.$on('socket-join', function(){

  });

  socket.on('pick-made', function(pickData){
    $scope.processPickMade(pickData);
  })

  $scope.makePick = function(){
    var url = '/draft/' + $scope.draftData.draftId;
    var drafteeName = $scope.draftData.currentPick;

    $http.post(url, { name: drafteeName })
      .success(function(data){
        var pickData = { 
          pickName: drafteeName, 
          name: $scope.draftData.name,
          socketId: $scope.draftData.socketId
        };

        console.log(data, 'pick has been made')
        socket.emit('pick-made', pickData);
      });
  }

  $scope.processPickMade = function(pickData){
    console.log(pickData, 'we received pick data');
  }
});



