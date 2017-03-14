stuffGameApp.controller('awaitStartController', function($scope) {
	$scope.canStartGame = false;

	$scope.start = function(){
		socket.emit('startGameRequest');
	}

	socket.on('canStartGame', (canStartGame) => {
		console.log('canStartGame: ', canStartGame);
		$scope.canStartGame = canStartGame;
		$scope.$apply();
	});
});
