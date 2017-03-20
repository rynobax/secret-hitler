secretHitlerApp.controller('initialController', function($scope, $state,     sessionService) {
    $scope.createGame = function(){
        socket.emit('newGameRequest'); // Request a unique code from the server
        socket.once('newGameResponse', result => {
            if(result.success){
                sessionService.resumeState = result.state;
                $state.transitionTo('host.lobby', {}, {reload: true});
            }
        });
    }
});
