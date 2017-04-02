secretHitlerApp.controller('examineCardsController', function($scope, $state, sessionService) {
    $scope.cards = sessionService.state.phase.cards;

    $scope.done = function(){
      socket.emit('examineCardsResponse');
    }
});
