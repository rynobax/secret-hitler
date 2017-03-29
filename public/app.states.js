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
	})
  .state({
		name: 'game.chancellorChooseCard',
		controller: 'chancellorChooseCardController',
		templateUrl: '/app/components/player/game/chancellorChooseCard/chancellorChooseCard.html'
	})
  .state({
		name: 'game.chooseChancellor',
		controller: 'chooseChancellorController',
		templateUrl: '/app/components/player/game/chooseChancellor/chooseChancellor.html'
	})
  .state({
		name: 'game.presidentChooseCard',
		controller: 'presidentChooseCardController',
		templateUrl: '/app/components/player/game/presidentChooseCard/presidentChooseCard.html'
	})
  .state({
		name: 'game.showRoles',
		controller: 'showRolesController',
		templateUrl: '/app/components/player/game/showRoles/showRoles.html'
	})
  .state({
		name: 'game.voteChancellor',
		controller: 'yesNoController',
		templateUrl: '/app/components/player/game/yesNo/yesNo.html'
	})
});
