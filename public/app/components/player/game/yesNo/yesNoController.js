secretHitlerApp.controller('yesNoController', function($scope, $state, sessionService) {
    const players = sessionService.state.players.map(e => e.name);
    const name = sessionService.state.phase.name;
    console.log('$scope.me: ', $scope.me);
    const voted = !$scope.me.awaitingVote;

    $scope.players = [];
    $scope.selectedPlayer = null;
    $scope.voted = voted;

    const president = sessionService.state.president;
    const chancellor = sessionService.state.phase.nominatedChancellor;
    const headerText = 'Elect '+president+' and '+chancellor+'?';
    $scope.header = headerText;

    $scope.vote = function(result){
      socket.emit('voteChancellorResponse', result);
      $scope.voted = true;
    }
});