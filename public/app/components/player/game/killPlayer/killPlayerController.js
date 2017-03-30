secretHitlerApp.controller('killPlayerController', function($scope, $state, sessionService) {
    const players = sessionService.state.players;
    const president = sessionService.state.president;

    $scope.players = players
      .filter(player => {
          if(player.name == president) return false;
          return player.alive;
      })
      .map(e => e.name);

    $scope.kill = function(player){
      socket.emit('killPlayerResponse', player);
    }
});
