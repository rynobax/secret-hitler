stuffGameApp.config(function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  /* Initial States */
  $stateProvider.state({
    name: 'initial',
    url: '/',
    controller: 'initialController',
    templateUrl: '/app/components/initial/initial.html'
  });

  /* Host States */
  $stateProvider.state({
    name: 'host',
    controller: 'hostController',
    templateUrl: '/app/components/host/host.html',
		abstract: true
  })
		.state({
	    name: 'host.lobby',
	    controller: 'lobbyController',
	    templateUrl: '/app/components/host/lobby/lobby.html'
  	})
		.state({
			name: 'host.prompt',
			controller: 'promptController',
			templateUrl: '/app/components/host/prompt/prompt.html'
		})
		.state({
			name: 'host.answers',
			controller: 'answersController',
			templateUrl: '/app/components/host/answers/answers.html'
		})
		.state({
			name: 'host.voteResults',
			controller: 'voteResultsController',
			templateUrl: '/app/components/host/voteResults/voteResults.html'
		})
		.state({
			name: 'host.roundResults',
			controller: 'roundResultsController',
			templateUrl: '/app/components/host/roundResults/roundResults.html'
		})
		.state({
			name: 'host.gameResults',
			controller: 'gameResultsController',
			templateUrl: '/app/components/host/gameResults/gameResults.html'
		});

  $stateProvider.state({
    name: 'main',
    controller: 'mainController',
    templateUrl: '/app/components/host/main/main.html'
  });

  /* Player States */
  $stateProvider.state({
    name: 'join',
    controller: 'joinController',
    templateUrl: '/app/components/player/join/join.html'
  });

  $stateProvider.state({
    name: 'game',
    controller: 'gameController',
    templateUrl: '/app/components/player/game/game.html',
		abstract: true
  })
		.state({
	    name: 'game.awaitStart',
	    controller: 'awaitStartController',
	    templateUrl: '/app/components/player/game/awaitStart/awaitStart.html'
  	})
		.state({
	    name: 'game.idle',
	    controller: 'idleController',
	    templateUrl: '/app/components/player/game/idle/idle.html'
	  }).state({
	    name: 'game.answerPrompt',
	    controller: 'answerPromptController',
	    templateUrl: '/app/components/player/game/answerPrompt/answerPrompt.html'
	  }).state({
	    name: 'game.vote',
	    controller: 'voteController',
	    templateUrl: '/app/components/player/game/vote/vote.html'
	  });
});
