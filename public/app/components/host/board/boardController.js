secretHitlerApp.controller('boardController', function($scope, $state, sessionService) {
  $scope.code = sessionService.state.code;
  $scope.players = sessionService.state.players.map(e => e.name);
  const data = sessionService.state.mode.data;
  $scope.president = data.president;
  $scope.chancellor = data.chancellor;
  $scope.lastPresident = data.lastPresident;
  $scope.lastChancellor = data.lastChancellor;
});
