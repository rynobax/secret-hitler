stuffGameApp.controller('promptController', function($scope, sessionService, $interval) {
	$scope.prompt = sessionService.data.prompt;
	$scope.time = sessionService.data.time;

	const countDown = function(){
		if($scope.time > 0) $scope.time -= 1;
	}
	$interval(countDown, 1000)
});
