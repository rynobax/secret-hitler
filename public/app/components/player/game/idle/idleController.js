secretHitlerApp.controller('idleController', function($scope, sessionService) {
	const phaseName = sessionService.state.phase.name;
	switch(phaseName){
		case 'chooseChancellor':
			$scope.idleText = 'Wait for the chancellor to be chosen';
			break;
		case 'voteResult':
			$scope.idleText = '';
			break;
		case 'presidentChooseCard':
			$scope.idleText = '';
			break;
		case 'chancellorChooseCard':
			$scope.idleText = '';
			break;
		default:
			$scope.idleText = 'Unknown phaseName ' + phaseName;
			break;
	}
});