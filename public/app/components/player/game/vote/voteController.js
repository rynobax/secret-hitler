stuffGameApp.controller('voteController', function($scope, sessionService) {
	let selectedName = '';
	let selectedAnswer = '';

	$scope.answers = sessionService.data.answers;

	$scope.clickAnswer = function(answer){
		$scope.answerClicked = true;
		$scope.header = answer;
		selectedAnswer = answer;
	}

	$scope.clickBack = function(){
		$scope.header = 'Pick a thing!'
		$scope.answerClicked = false;
	}

	$scope.clickName = function(name){
		selectedName = name;
		socket.emit('vote', {
			name: $scope.name,
			selectedName: selectedName,
			selectedAnswer: selectedAnswer
		});
	}

	// This function re-initializes the controller, so call it to initialize!
	$scope.clickBack();
});
