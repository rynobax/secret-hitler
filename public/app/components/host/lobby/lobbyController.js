stuffGameApp.controller('lobbyController', function($scope, $state, sessionService) {
  $scope.code = '';
  $scope.players = [];

  socket.emit('newGameRequest'); // Request a unique code from the server
  socket.on('newGameResponse', code => {
    $scope.code = code;
    $scope.$apply();
  });

	socket.on('newPlayer', name => {
		console.log('New player ' + name);
		$scope.players.push(name);
    $scope.$apply();
	});
});
