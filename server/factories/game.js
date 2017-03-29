const Player = rootRequire('server/factories/player.js');
const GameCoordinator = rootRequire('server/game/gameCoordinator.js');
const _ = require('lodash');

module.exports = function(_code, _socket, _io){
	const host = _socket;

	/**
	 * Player
	 * 	string name
	 * 	Socket socket
	 * 	string role
	 * 	bool	 alive
	 */
	let players = [];

	function findPlayer(name){
		return _.find(players, ['name', name]);
	}

	let started = false;

	const code = _code;

	_socket.join(code);
	const sockets = _io.in(code);

	/* The names of the officials */
	let president;
	let lastPresident;
	let chancellor;
	let lastChancellor;

	/* Constants */
	const liberalPoliciesToWin = 5;
	const fascistPoliciesToWin = 6;
	const fascistHitlerThreshold = 3;

	/* Hitler can win */
	let hitlerCanWin = false;

	/* Ability */
	let specialPresidentRound = false;

	/* Presidential Abilities */
	function getPresidentialAbility(){
		const playerCount = players.length
		const fascistEnacted = getFascistEnactedCount();
		let abilities = [];
		switch(playerCount){
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				abilities = [null, null, 'examine', 'kill', 'kill', null];
				break;
			case 7:
			case 8:
				abilities = [null, 'investigate', 'pick', 'kill', 'kill', null];
				break;
			case 9:
			case 10:
				abilities = ['investigate', 'investigate', 'pick', 'kill', 'kill', null];
				break;
			default:
				throw Error('Too many players!');
				break;
		}
		return abilities[fascistEnacted-1];
	}

	/* Failed election tracker */
	let failedElectionCount = 0;

	/* Policy tracker */
	let enacted = [];
	let drawPile = [];
	let discardPile = [];

	/* Initialize the pile */
	for(let i=0; i<11; i++){
		discardPile.push('Fascist');
	}
	for(let i=0; i<6; i++){
		discardPile.push('Liberal');
	}
	
	function getFascistEnactedCount(){
		return enacted.filter(e => e == 'Fascist').length;
	}
	
	function getLiberalEnactedCount(){
		return enacted.filter(e => e == 'Liberal').length;
	}

	function drawCards(n){
		// Removes cards, so make sure you add them to discard pile
		return drawPile.splice(0, n);
	}

	/* Create the state object sent to the clients */
	function getState(phase){
		return {
			players: players.map(e => {
				return {
					name: e.name,
					role: e.role,
					alive: e.alive
				}
			}
			),
			phase: phase,
			code: code,
			president: president,
			chancellor: chancellor,
			lastChancellor: lastChancellor,
			lastPresident: lastPresident
		}
	}

	function addPlayer(name, playerSocket){
		if(started) return false;
		if(players.length < 10){
			const player = Player(name, playerSocket);
    	players.push(player);
			playerSocket.join(code);
			playerSocket.on('startGameRequest', start);
			emitState({
				name: 'lobby',
				ready: true
			});
			return true;
		}else{
			return false;
		}
	}

	function emitState(phase){
		sockets.emit('state', getState(phase));
	}

	function start(){
		hitlerCanWin = false;
		assignRoles();
		randomizePresidentOrder();
		showRoles();
		started = true;
		setTimeout(beginRound, 1000);
	}

	function beginRound(){
		if(!specialPresidentRound){
			setNextPresident();
		}else{
			specialPresidentRound = false;
		}
		shuffleIfNecessary();
		legislate()
			.then((policyEnacted) => {
				if(policyEnacted){
					// If liberals have enough policies, they win
					if(getLiberalEnactedCount() == liberalPoliciesToWin){
						return 'Liberal';
					}

					// If fascists have enough policies, they win
					if(getFascistEnactedCount() == fascistPoliciesToWin){
						return 'Fascist';
					}

					// If Hitler is chancellor and enough fascist policies, the game ends
					if(hitlerCanWin && findPlayer(chancellor).role == 'Hitler'){
						return 'Fascist';
					}

					// If enough facist policies are enacted, hitler can win by being elected chancellor
					if(getFascistEnactedCount() == fascistHitlerThreshold){
						hitlerCanWin = true;
					}

					// If a fascist was enacted and a power needs to be used, use it
					const lastPolicyEnacted = enacted.slice(-1)[0];
					if(lastPolicyEnacted == 'Fascist'){
						const ability = getPresidentialAbility();
						switch(ability){
							case null:
								return;
							case 'examine':
								return examineCards();
								break;
							case 'kill':
								return killPlayer();
								break;
							case 'investigate':
								return investigatePlayer();
								break;
							case 'pick':
								return pickNextPresident();
								break;
							default:
								throw Error('Invalid ability');
						}
					}
				}else{
					return false;
				}
			})
			.then((winner) => {
				if(winner){
					console.log('The game is over, ' + winner + ' won');
				}else{
					beginRound();
				}
			});
	}

	function examineCards(){
		// Examine the top 3 cards on draw pile
		return new Promise((resolve, reject) => {
			const cards = drawCards(3);
			drawPile.push(...cards);
			emitState({
				name: 'examineCards',
				cards: cards
			});
			findPlayer(president).once('examineCardsResponse', () => {
				resolve(false);
			});
		});
	}

	function killPlayer(){
		// Kill another player
		return new Promise((resolve, reject) => {
			emitState({
				name: 'killPlayer'
			});
			findPlayer(president).once('killPlayerResponse', (player) => {
				if(player.role == 'Hitler'){
					// Hitler was killed, so the game ends
					resolve('Liberal');
				}else{
					// Kill the player and continue the game
					findPlayer(player).alive = false;
					resolve(false);
				}
			});
		});
	}

	function investigatePlayer(){
		// Investigate another player's affiliation
		return new Promise((resolve, reject) => {
			emitState({
				name: 'investigatePlayer'
			});
			findPlayer(president).once('investigatePlayerResponse', (player) => {
				resolve(false);
			});
		});
	}

	function pickNextPresident(){
		// Pick the next president
		return new Promise((resolve, reject) => {
			specialPresidentRound = true;
			emitState({
				name: 'pickNextPresident'
			});
			findPlayer(president).once('pickNextPresidentResponse', (player) => {
				president = player;
				resolve(false);
			});
		});
	}

	function showRoles(){
		emitState(
			emitState({
				name: 'showRoles'
			}));
	}

	function shuffleIfNecessary(){
		if(drawPile.length < 3){
			const allCards = _.concat(drawPile, discardPile);
			drawPile = _.shuffle(allCards);
		}
	}

	// Resolves true if policy was enacted, false if not
	function legislate(){
		// Legislation has started
		return new Promise((resolve, reject) => {
			chooseChancellor()
			.then((chancellor) => {
				return voteOnChancellor(chancellor);
			})
			.then((votePassed) => {
				return notifyVoteResult(votePassed);
			})
			.then((votePassed) => {
				if(votePassed){
					failedElectionCount = 0;
					return enactPolicy();
				}else{
					failedElectionCount++;
					if(failedElectionCount > 3){
						failedElectionCount = 0;
						enacted.push(drawCards(1));
						return true;
					}else{
						return false;	
					}
				}
			})
			.catch(e => {
				console.error('Error: ' + e);
			})
			.then(resolve);
		});
	}
	
	// Resolves choice for next chancellor (chosen by president)
	function chooseChancellor(){
		emitState({
			name: 'chooseChancellor'
		});
		return new Promise((resolve, reject) => {
			findPlayer(president).socket.on('chooseChancellorResponse', (chancellor) => {
				resolve(chancellor);
			});
		});
	}

	// Resolves result of overall vote (true or false)
	function voteOnChancellor(nominatedChancellor){
		emitState({
			name: 'voteChancellor',
			nominatedChancellor: nominatedChancellor
		});
		return new Promise((resolve, reject) => {
			Promise.all(players.map(player => getChancellorVote(player)))
				.then(res => {
					return res.reduce((a, e) => {
						if(e === true){
							a.true++;
							return a;
						}else{
							a.false++;
							return a;
						}
					}, {true: 0, false: 0});
				})
				.then(votes => {
					if(votes.true >= votes.false){
						chancellor = nominatedChancellor;
						resolve(true);
					}else{
						resolve(false);
					}
				});
		});
	}

	// Resolves individual vote result (true or false)
	function notifyVoteResult(votePassed){
		return new Promise((resolve, reject) => {
			emitState({
				name: 'voteResult',
				result: votePassed
			});
			setTimeout(() => resolve(votePassed), 1000);
		});
	}

	function getChancellorVote(player){
		return new Promise((resolve, reject) => {
			player.socket.once('voteChancellorResponse', (response) => {
				resolve(response);
			});
		});
	}

	// Resolves true if card was enacted, false if not
	// Removes card from piles
	function enactPolicy(){
		return new Promise((resolve, reject) => {
			const cards = drawCards(3);
			givePresidentCards(cards)
				.then(removed => {
					discardPile.push(removed);
					cards.splice(_.findIndex(removed), 1);
					return giveChancellorCards(cards);
				})
				.then(enact => {
					// TODO: Add support for vetoing
					if(enact == null){
						// It was vetoed
						cards.forEach((card) => {
							discardPile.push(card);
						});
						resolve(false);
					}else{
						// Something was enacted
						cards.splice(_.findIndex(enact), 1);
						discardPile.push(cards[0]);
						enacted.push(enact);
						resolve(true);
					}
				});
		});
	}

	// Resolves the card REMOVED ('Fascist' or 'Liberal')
	function givePresidentCards(cards){
		emitState({
			name: 'presidentChooseCard',
			cards: cards
		});
		return new Promise((resolve, reject) => {
			findPlayer(president).socket.on('presidentChooseCardResponse', (discard) => {
				resolve(discard);
			});
		});
	}

	// Resolves the card ENACTED ('Fascist' or 'Liberal') OR null if choices are vetoed
	function giveChancellorCards(cards){
		emitState({
			name: 'giveChancellorCards',
			cards: cards
		});
		return new Promise((resolve, reject) => {
			findPlayer(chancellor).socket.on('chancellorChooseCardResponse', (enact) => {
				resolve(enact);
			});
		});
	}

	function getRoles(){
		return ['Hitler', 'Fascist', 'Liberal', 'Liberal', 'Liberal', 'Liberal', 'Facist', 'Liberal', 'Facist', 'Liberal']
			.slice(0, players.length);
	}

	function assignRoles(){
		const roles = getRoles();
		_.shuffle(players.map(e => e.name)).forEach((name, i) => {
			const player = findPlayer(name);
			const role = roles[i];
			player.role = role;
		});
	}

	function randomizePresidentOrder(){
		players = _.shuffle(players);
	}

	function setNextPresident(votePassed){
		players.push(players.shift());
		if(votePassed){
			lastChancellor = chancellor;
			lastPresident = president;
		}
		chancellor = '';
		president = players[0].name;
	}

	/* Return public methods */
	return {
		host: host,
		code: code,
		players: players,
		addPlayer: addPlayer,
		start: start,
		getState: getState
	}
}
