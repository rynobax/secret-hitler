secretHitlerApp.controller('awaitStartController', function($scope, sessionService) {
	$scope.canStartGame = false;

	try{
		$scope.canStartGame = sessionService.state.mode.data.ready;
	}catch(e){
		console.log('Error: ', e);
	}

	$scope.start = function(){
		socket.emit('startGameRequest');
	}
});
