secretHitlerApp.controller('yesNoController', function($scope, $state, sessionService) {
    const players = sessionService.state.players.map(e => e.name);
    const data = sessionService.state.mode.data;
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
        const president = data.president;
        const chancellor = data.chancellor;
        const lastPresident = data.lastPresident;
        const lastChancellor = data.lastChancellor;
        const headerText = 'Elect '+president+' and '+chancellor+'?';
        $scope.header = headerText;
    }

    $scope.vote = function(result){
      socket.emit('voteChancellorResponse', result);
      $scope.voted = true;
    }
});