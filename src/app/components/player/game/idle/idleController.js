secretHitlerApp.controller('idleController', function($scope, sessionService) {
	if(!$scope.me.alive){
		$scope.idleText = 'You are dead!';
		return;
	}
	const phaseName = sessionService.state.phase.name;
	switch(phaseName){
		case 'chooseChancellor':
			$scope.idleText = 'Wait for the chancellor to be chosen';
			break;
		case 'voteResult':
			$scope.idleText = '';
			break;
		case 'presidentChooseCard':
			$scope.idleText = 'Wait for the president to choose a card to discard.';
			break;
		case 'chancellorChooseCard':
			$scope.idleText = 'Wait for the chancellor to choose a card to enact.';
			break;
		case 'examineCards':
			$scope.idleText = 'Wait for the president to examine the next 3 cards.';
			break;
		case 'killPlayer':
			$scope.idleText = 'Wait for the president to kill someone.';
			break;
		case 'investigatePlayer':
			$scope.idleText = 'Wait for the president to investigate a player\'s party affiliation.';
			break;
		default:
			$scope.idleText = 'Unknown phaseName ' + phaseName;
			break;
	}
});