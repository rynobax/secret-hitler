stuffGameApp.controller('joinController', function($scope, $state, sessionService) {
  $scope.roomCode = '';
  $scope.name = '';

	let submittedCode = '';
	let submittedName = '';
  $scope.submit = function(){
		const code = $scope.roomCode.toUpperCase();
		const name = $scope.name.toUpperCase();
    socket.emit('joinGameRequest', {
			name: name,
			code: code
		});
		submittedName = name;
		submittedCode = code;
  }

	socket.on('joinGameResponse', res => {
		if(res == 'full'){
			alert('Game is full!');
		}
		else if (res == 'dne'){
			alert('Game "' + submittedCode + '" does not exist!');
		}
		else if (res == 'repeatName'){
			alert('Someone is already using the name ' + submittedName + '!');
		}
		else{
			socket.off('joinGameResponse');
			sessionService.name = submittedName;
			sessionService.code = submittedCode;
			$state.transitionTo('game.awaitStart');
		}
	});
});
