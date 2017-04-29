secretHitlerApp.controller('boardController', function($scope, $state, sessionService) {
  assignScopeFromState(sessionService.state);

  $scope.getFailedElection = function(){
    return new Array($scope.failedElectionThreshold);
  }

  $scope.getLiberalTiles = function(){
    return new Array($scope.liberalNeeded);
  }

  $scope.getFascistTiles = function(){
    return $scope.abilities;
  }

  function assignScopeFromState(state){
    $scope.state = state; //Just for testing

    $scope.code = sessionService.state.code;
    $scope.players = state.players;
    // $scope.phase = state.phase;
    $scope.president = state.president;
    $scope.chancellor = state.chancellor;
    $scope.lastPresident = state.lastPresident;
    $scope.lastChancellor = state.lastChancellor;
    $scope.liberalEnacted = state.liberalEnacted;
    $scope.liberalNeeded = state.liberalNeeded;
    $scope.fascistEnacted = state.fascistEnacted;
    $scope.fascistNeeded = state.fascistNeeded;
    $scope.fascistHitlerThreshold = state.fascistHitlerThreshold;
    $scope.failedElectionCount = state.failedElectionCount;
    $scope.failedElectionThreshold = state.failedElectionThreshold;
    $scope.voteInProgress = state.voteInProgress;
    $scope.abilities = state.abilities.map(e => {
      if(!e) return e;
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
  }

  socket.on('state', state => {
    assignScopeFromState(state);

    handlePhase(state);
    $scope.$apply();
	});

  function handlePhase(state){
    switch(state.phase.name){
      default:
        $scope.phaseName = state.phase.name;
        break;
    }
  }
});
