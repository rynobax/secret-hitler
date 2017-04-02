secretHitlerApp.controller('initialController', function($scope, $state,     sessionService) {
    $scope.createGame = function(){
        socket.emit('newGameRequest', (result) => {
            if(result.success){
                sessionService.resumeState = result.state;
                $state.transitionTo('host.lobby', {}, {reload: true});
            }
        });
    }
});
