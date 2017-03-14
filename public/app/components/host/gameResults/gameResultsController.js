stuffGameApp.controller('gameResultsController', function($scope, sessionService) {
	$scope.points = sessionService.data.points;
});
