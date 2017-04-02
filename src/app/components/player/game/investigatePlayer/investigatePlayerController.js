secretHitlerApp.controller('investigatePlayerController', function($scope, $state, sessionService) {
    const players = sessionService.state.players;
    const president = sessionService.state.president;

    $scope.investigating = false;

    $scope.players = players
      .filter(player => {
          if(player.name == president) return false;
          return player.alive;
      })
      .map(e => e.name);

    $scope.investigate = function(player){
      const investigatedPlayer = players.find(e => e.name == player);
      $scope.investigatedPlayerName = investigatedPlayer.name;
      $scope.investigatedPlayerRole = getRole(investigatedPlayer.role);
      $scope.investigating = true;
    }

    function getRole(role){
      if(role == 'Hitler'){
        return 'Fascist';
      }else{
        return role;
      }
    }

    $scope.done = function(){
      socket.emit('investigatePlayerResponse');
    }
});
