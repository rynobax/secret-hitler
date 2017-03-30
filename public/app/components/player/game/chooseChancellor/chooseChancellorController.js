secretHitlerApp.controller('chooseChancellorController', function($scope, $state, sessionService) {
    const players = sessionService.state.players;
    const president = sessionService.state.president;
    const lastPresident = sessionService.state.lastPresident;
    const lastChancellor = sessionService.state.lastChancellor;

    $scope.players = players
        .filter(player => {
            const name = player.name;
            console.log('player: ', player);
            console.log('president: ', president);
            console.log('lastPresident: ', lastPresident);
            console.log('lastChancellor: ', lastChancellor);
            if(name == president || name == lastPresident || name == lastChancellor) return false;
            return player.alive;
        })
        .map(e => e.name);

    $scope.choose = function(player){
        socket.emit('chooseChancellorResponse', player);
    };
});
