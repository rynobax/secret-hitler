stuffGameApp.controller('idleController', function($scope, sessionService) {
		$scope.text = sessionService.data.text;
});
