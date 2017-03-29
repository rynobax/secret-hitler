secretHitlerApp.controller('gameController', function($scope, $state, sessionService) {
	// These are accessable from child states
	$scope.code = sessionService.code;
	$scope.name = sessionService.name;
	$scope.state = sessionService.state;
	$scope.me = sessionService.me;

	angular.element('#modal').modal('hide');

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
		switch(newState.mode.name){
			case 'lobby':
				$state.transitionTo('game.awaitStart', {}, {reload: true});
				break;
			case 'chooseChancellor':
				handleChooseChancellor(newState, sessionService.me)
				break;
			case 'voteChancellor':
				$state.transitionTo('game.voteChancellor', {}, {reload: true});
				break;
			case 'showRoles':
				$state.transitionTo('game.showRoles', {}, {reload: true});
				break;
			case 'voteResult':
				$state.transitionTo('game.idle', {}, {reload: true});
				break;
			case 'presidentChooseCard':
				handlePresidentChooseCard(newState, sessionService.me)
				break;
			case 'chancellorChooseCard':
				handleChancellorChooseCard(newState, sessionService.me)
				break;
			default:
				console.log('Unknown newState: ', newState.mode.name);
				break;
		}
	}

	function handleChooseChancellor(state, me){
		if(me.name == state.president){
			$state.transitionTo('game.chooseOne', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}

	function handlePresidentChooseCard(state, me){
		if(me.name == state.president){
			$state.transitionTo('game.chooseOne', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}

	function handleChancellorChooseCard(state, me){
		if(me.name == state.chancellor){
			$state.transitionTo('game.chooseOne', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}
});
