secretHitlerApp.controller('lobbyController', function($scope, $state, sessionService) {
  $scope.code = sessionService.state.code;
  $scope.players = sessionService.state.players.map(e => e.name);
});
