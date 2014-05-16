var draftLobbyApp = angular.module('draftLobbyApp', []);

var controller = draftLobbyApp
  .controller('draftController', function($http, $window, $scope) {
    
    $scope.leagueId = $window.location.pathname.substring(7);  
    var url = '/draft-info/' + $scope.leagueId;

    $http.get(url)
      .success(function(data) {
        $scope.draftData = data;
        console.log($scope.draftData)
    });
  });

