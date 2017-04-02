secretHitlerApp.controller('hostController', function($scope, $state, sessionService) {
	if(sessionService.resumeState){
		const state = sessionService.resumeState;
		sessionService.resumeState = null;
		console.log('resume state: ', state);
		loadState(state);
	}else{
		socket.once('state', state => {
			console.log('state: ', state);
			loadState(state);
		});
	}

	function loadState(newState){
		const oldState = sessionService.state;
		sessionService.state = newState;

		sessionService.me = newState.players.find(e => {
			return e.name == sessionService.name;
		});

		const phaseName = newState.phase.name;
		switch(phaseName){
			case 'lobby':
				$state.transitionTo('host.lobby', {}, {reload: true});
				break;
			default:
				$state.transitionTo('board', {}, {reload: true});
				break;
		}
	}
});
