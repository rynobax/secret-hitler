secretHitlerApp.controller('chooseChancellorController', function($scope, $state, sessionService) {
    const players = sessionService.state.players.map(e => e.name);
    const president = sessionService.state.president;
    const lastPresident = sessionService.state.lastPresident;
    const lastChancellor = sessionService.state.lastChancellor;

    $scope.players = players.filter(player => {
        if(player == president || player == lastPresident || player == lastChancellor) return false;
        return true;
    });

    $scope.choose = function(player){
        socket.emit('chooseChancellorResponse', player);
    };
});
