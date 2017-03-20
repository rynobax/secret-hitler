secretHitlerApp.controller('idleController', function($scope, sessionService) {
	$scope.idleText = sessionService.state.mode.data.text;
});
