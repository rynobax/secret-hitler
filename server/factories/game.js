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
	 */
	let players = [];

	const code = _code;
	const mode = {
		name: 'lobby',
		data: {
			ready: false
		}
	};

	_socket.join(code);
	const sockets = _io.in(code);

	/* The names of the officials */
	let president;
	let chancellor;
	let lastChancellor;

	/* Policy tracker */
	const policies = {
		liberal: 0,
		fascist: 0
	};
	const drawPile = [];
	const discardPile = [];
	for(let i=0; i<11; i++){
		discardPile.push('Fascist');
	}
	for(let i=0; i<6; i++){
		discardPile.push('Liberal');
	}
	function drawCards(){
		// Removes cards, so make sure you add them to discard pile
		return drawPile.splice(0, 3);
	}

	/* Create the state object sent to the clients */
	const getState = function(){
		return {
			players: players.map(e => {
				return {
					name: e.name,
					role: e.role
				}
			}
			),
			mode: mode,
			code: code
		}
	}

	const addPlayer = function(name, playerSocket){
		if(mode.name != 'lobby') return false;
		if(players.length < 10){
			const player = Player(name, playerSocket);
    		players.push(player);
			playerSocket.join(code);
			mode.data = {};
			mode.data.ready = true;
			playerSocket.on('startGameRequest', start);
			emitState();
			return true;
		}else{
			return false;
		}
	}

	const emitState = function(){
		sockets.emit('state', getState());
	}

	const findPlayer = function(name){
		return _.find(players, ['name', name]);
	}

	const start = function(){
		assignRoles();
		randomizePresidentOrder();
		showRoles();
		setTimeout(beginRound, 1000);
	}

	function beginRound(){
		setNextPresident();
		shuffleIfNecessary();
		legislate()
			.then((policy) => {
				// If liberals have enough policies, they win
				// If fascists have enough policies, they win
				// If Hitler is chancellor and enough fascist policies, the game ends
				// If a fascist was enacted and a power needs to be used, use it
			})
			.then((gameOver) => {
				if(gameOver){
					console.log('The game is over');
				}else{
					beginRound();
				}
			});
	}

	function showRoles(){
		mode.name = 'showRoles';
		emitState();
	}

	function shuffleIfNecessary(){
		if(drawPile.length < 3){
			const allCards = _.concat(drawPile, discardPile);
			drawPile = _.shuffle(allCards);
		}
	}

	// Resolves the policy that was enacted ('Facist', 'Liberal', or null)
	function legislate(){
		// Legislation has started
		return new Promise((resolve, reject) => {
			chooseChancellor()
			.then((chancellor) => {
				return voteOnChancellor(chancellor);
			})
			.then((votePassed) => {
				return notifyVoteResult();
			})
			.then((votePassed) => {
				if(votePassed){
					return enactPolicy();
				}else{
					// TODO: Move failed vote tracker and take action if necessary
					return Promise.resolve(null);	
				}
			})
			.catch(e => {
				console.log('Error: ' + e);
			})
			.then(resolve);
		});
	}
	
	// Resolves choice for next chancellor (chosen by president)
	function chooseChancellor(){
		mode.name = 'chooseChancellor';
		mode.data = {};
		mode.data.president = president;
		mode.data.chancellor = chancellor;
		mode.data.lastChancellor = lastChancellor;
		mode.data.text = 'Wait for a chancellor to be selected...';
		mode.data.presidentText = 'Select your chancellor...';
		setTimeout(emitState, 1000);
		return new Promise((resolve, reject) => {
			findPlayer(president).socket.on('chooseChancellorResponse', (chancellor) => {
				resolve(chancellor);
			});
		});
	}

	// Resolves result of overall vote (true or false)
	function voteOnChancellor(nominatedChancellor){
		mode.name = 'voteChancellor';
		mode.data = {};
		mode.data.president = president;
		mode.data.chancellor = nominatedChancellor;
		mode.data.lastChancellor = lastChancellor;
		setTimeout(emitState, 1000);
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
					resolve(votes.true >= votes.false);
				});
		});
	}

	// Resolves individual vote result (true or false)
	function notifyVoteResult(votePassed){
		return new Promise((resolve, reject) => {
			mode.name = 'voteResult';
			mode.data = {};
			mode.data.president = president;
			mode.data.chancellor = chancellor;
			if(votePassed){
				mode.data.text = 'Vote passed!';
			}else{
				mode.data.text = 'Vote failed!';
			}
			emitState();
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

	// Resolves the card ENACTED ('Fascist' or 'Liberal')
	function enactPolicy(){
		return new Promise((resolve, reject) => {
			const cards = drawCards();
			givePresidentCards(cards)
				.then(removed => {
					discardPile.push(removed);
					cards.splice(_.findIndex(removed), 1);
					return giveChancellorCards(cards);
				})
				.then(enact => {
					if(enact == null){
						// It was vetoed
						cards.forEach((card) => {
							discardPile.push(card);
						});
						resolve(null);
					}else{
						// Something was enacted
						cards.splice(_.findIndex(enact), 1);
						discardPile.push(cards[0]);
						resolve(enact);
					}
				});
		});
	}

	// RESUME Implement the below 2 functions on the front end

	// Resolves the card REMOVED ('Fascist' or 'Liberal')
	function givePresidentCards(cards){
		mode.name = 'presidentChooseCard';
		mode.data = {};
		mode.data.text = 'President is selecting a card to discard';
		mode.data.cards = cards;
		mode.data.presidentText = 'Select a card to discard';
		setTimeout(emitState, 1000);
		return new Promise((resolve, reject) => {
			findPlayer(president).socket.on('presidentChooseCardResponse', (discard) => {
				resolve(discard);
			});
		});
	}

	// Resolves the card ENACTED ('Fascist' or 'Liberal') OR null if choices are vetoed
	function giveChancellorCards(cards){
		mode.name = 'chancellorChooseCard';
		mode.data = {};
		mode.data.text = 'Chancellor is selecting a card to enact';
		mode.data.cards = cards;
		mode.data.chancellorText = 'Select a card to enact';
		setTimeout(emitState, 1000);
		return new Promise((resolve, reject) => {
			findPlayer(president).socket.on('chancellorChooseCardResponse', (enact) => {
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
		}
		chancellor = '';
		president = players[0].name;
	}

	function getChancellorCandidates(){
		return players.map(e => e.name).filter(player => {
			if(player === lastPresident || player === lastChancellor) return false;
			return true;
		});
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
