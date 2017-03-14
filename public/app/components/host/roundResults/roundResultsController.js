stuffGameApp.controller('roundResultsController', function($scope, sessionService) {
	$scope.points = sessionService.data.points;
});
