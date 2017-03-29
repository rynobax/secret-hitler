secretHitlerApp.controller('presidentChooseCardController', function($scope, $state, sessionService) {
    $scope.cards = sessionService.state.phase.cards;

    $scope.chooseCard = function(card){
        socket.emit('presidentChooseCardResponse', card);
    };
});
