stuffGameApp.controller('answerPromptController', function($scope) {
	$scope.answer = '';

	$scope.submit = function(){
		socket.emit('promptAnswer', {
			name: $scope.name,
			answer: $scope.answer
		});
	}
});
