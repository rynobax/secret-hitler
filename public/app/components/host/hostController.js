stuffGameApp.controller('hostController', function($scope, $state, sessionService) {
	socket.once('hostUpdate', res => {
		console.log('Trasitioning to host.' + res.state);
		console.log('data: ', res.data);
		sessionService.data = res.data;
		$state.transitionTo('host.'+res.state, {}, {reload: true});
	});
});
