secretHitlerApp.controller('boardController', function($scope, $state, sessionService) {
  $scope.code = sessionService.state.code;

  $scope.players = sessionService.state.players.map(e => e.name);
  const phase = sessionService.state.phase;
  $scope.president = phase.president;
  $scope.chancellor = phase.chancellor;
  $scope.lastPresident = phase.lastPresident;
  $scope.lastChancellor = phase.lastChancellor;

  socket.on('state', state => {
    $scope.players = state.players.map(e => e.name);
    $scope.president = state.phase.president;
    $scope.chancellor = state.phase.chancellor;
    $scope.lastPresident = state.phase.lastPresident;
    $scope.lastChancellor = state.phase.lastChancellor;

    handlePhase(state);
    $scope.$apply();
	});

  function handlePhase(state){
    switch(state.phase.name){
      default:
        console.log(state.phase.name);
        break;
    }
  }
});
