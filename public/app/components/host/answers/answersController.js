stuffGameApp.controller('answersController', function($scope, sessionService, $interval) {
	$scope.answers = sessionService.data.answers;
	$scope.time = sessionService.data.time;

	const countDown = function(){
		if($scope.time > 0) $scope.time -= 1;
	}
	$interval(countDown, 1000)
});
