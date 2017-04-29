secretHitlerApp.controller('showRolesController', function($scope, $state, sessionService) {
  const me = sessionService.me;
  console.log('me: ', me);
  $scope.role = me.role;
  $scope.players = sessionService.state.players;
  $scope.fascists = $scope.players.filter(player => player.role == 'Fascist');
  $scope.hitlers = $scope.players.filter(player => player.role == 'Hitler');
  console.log('fascists: ', $scope.fascists);
});