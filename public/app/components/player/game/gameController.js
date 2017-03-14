stuffGameApp.controller('gameController', function($scope, $state, sessionService) {
	// These are accessable from child states
	$scope.header = sessionService.name;
	$scope.code = sessionService.code;
	$scope.name = sessionService.name;

	socket.once('gameUpdate', res => {
		console.log('Trasitioning to game.' + res.state);
		console.log('data: ', res.data);
		sessionService.data = res.data;
		$state.transitionTo('game.'+res.state, {}, {reload: true});
	});
});
