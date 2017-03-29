secretHitlerApp.controller('yesNoController', function($scope, $state, sessionService) {
    const players = sessionService.state.players.map(e => e.name);
    const name = sessionService.state.mode.name;

    $scope.players = [];
    $scope.selectedPlayer = null;
    $scope.voted = false;

    switch(name){
        case 'voteChancellor':
            voteChancellor();
            break;
        default:
            break;
    }

    function voteChancellor(){
        const president = sessionService.state.president;
        const chancellor = sessionService.state.mode.data.nominatedChancellor;
        const headerText = 'Elect '+president+' and '+chancellor+'?';
        $scope.header = headerText;
    }

    $scope.vote = function(result){
      socket.emit('voteChancellorResponse', result);
      $scope.voted = true;
    }
});