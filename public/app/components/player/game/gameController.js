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

		if(!sessionService.me.alive){
			$state.transitionTo('game.idle', {}, {reload: true});
			return;
		}

		const phaseName = newState.phase.name;
		console.log('phaseName: ', phaseName);
		switch(phaseName){
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
			case 'examineCards':
				handleExamineCards(newState, sessionService.me)
				break;
			case 'killPlayer':
				handleKillPlayer(newState, sessionService.me)
				break;
			case 'pickNextPresident':
				handlePickNextPresident(newState, sessionService.me)
				break;
			case 'investigatePlayer':
				handleInvestigatePlayer(newState, sessionService.me)
				break;
			default:
				console.log('Unknown newState: ', phaseName);
				break;
		}
	}

	function handleChooseChancellor(state, me){
		if(me.name == state.president){
			$state.transitionTo('game.chooseChancellor', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}

	function handlePresidentChooseCard(state, me){
		if(me.name == state.president){
			$state.transitionTo('game.presidentChooseCard', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}

	function handleChancellorChooseCard(state, me){
		if(me.name == state.chancellor){
			$state.transitionTo('game.chancellorChooseCard', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}

	function handleExamineCards(state, me){
		if(me.name == state.president){
			$state.transitionTo('game.examineCards', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}

	function handleKillPlayer(state, me){
		if(me.name == state.president){
			$state.transitionTo('game.killPlayer', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}

	function handlePickNextPresident(state, me){
		if(me.name == state.president){
			$state.transitionTo('game.pickNextPresident', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}

	function handleInvestigatePlayer(state, me){
		if(me.name == state.president){
			$state.transitionTo('game.investigatePlayer', {}, {reload: true});
		}else{
			$state.transitionTo('game.idle', {}, {reload: true});
		}
	}
});
