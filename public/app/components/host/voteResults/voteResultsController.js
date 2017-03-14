stuffGameApp.controller('voteResultsController', function($scope, sessionService, $interval) {
	$scope.results = sessionService.data.results;

	const countDown = function(){
		if($scope.time > 0) $scope.time -= 1;
	}
	$interval(countDown, 1000)
});
