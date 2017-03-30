secretHitlerApp.config(function($stateProvider, $locationProvider) {
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
			name: 'host.board',
			controller: 'boardController',
			templateUrl: '/app/components/host/board/board.html'
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
  });
	$stateProvider.state({
		name: 'game.awaitStart',
		controller: 'awaitStartController',
		templateUrl: '/app/components/player/game/awaitStart/awaitStart.html'
	});
	$stateProvider.state({
		name: 'game.idle',
		controller: 'idleController',
		templateUrl: '/app/components/player/game/idle/idle.html'
	});
  $stateProvider.state({
		name: 'game.chancellorChooseCard',
		controller: 'chancellorChooseCardController',
		templateUrl: '/app/components/player/game/chancellorChooseCard/chancellorChooseCard.html'
	});
  $stateProvider.state({
		name: 'game.chooseChancellor',
		controller: 'chooseChancellorController',
		templateUrl: '/app/components/player/game/chooseChancellor/chooseChancellor.html'
	});
  $stateProvider.state({
		name: 'game.presidentChooseCard',
		controller: 'presidentChooseCardController',
		templateUrl: '/app/components/player/game/presidentChooseCard/presidentChooseCard.html'
	});
  $stateProvider.state({
		name: 'game.examineCards',
		controller: 'examineCardsController',
		templateUrl: '/app/components/player/game/examineCards/examineCards.html'
	});
  $stateProvider.state({
		name: 'game.showRoles',
		controller: 'showRolesController',
		templateUrl: '/app/components/player/game/showRoles/showRoles.html'
	});
  $stateProvider.state({
		name: 'game.voteChancellor',
		controller: 'yesNoController',
		templateUrl: '/app/components/player/game/yesNo/yesNo.html'
	});
  $stateProvider.state({
		name: 'game.killPlayer',
		controller: 'killPlayerController',
		templateUrl: '/app/components/player/game/killPlayer/killPlayer.html'
	});
  $stateProvider.state({
		name: 'game.pickNextPresident',
		controller: 'pickNextPresidentController',
		templateUrl: '/app/components/player/game/pickNextPresident/pickNextPresident.html'
	});
  $stateProvider.state({
		name: 'game.investigatePlayer',
		controller: 'investigatePlayerController',
		templateUrl: '/app/components/player/game/investigatePlayer/investigatePlayer.html'
	});
});
