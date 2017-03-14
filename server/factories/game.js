const Player = rootRequire('server/factories/player.js');
const GameCoordinator = rootRequire('server/game/gameCoordinator.js');
const _ = require('lodash');

module.exports = function(_code, _socket, _io){
	const players = [];
	const code = _code;

	/* Private */
	const hostSocket = _socket;
	const playersSockets = _io.in(code);

	let president;
	let chancellor;
	let lastPresident;
	let lastChancellor;

	const addPlayer = function(name, playerSocket){
		if(players.length < 10){
			const player = Player(name, playerSocket);
    		players.push(player);
			playerSocket.join(code);
			hostSocket.emit('newPlayer', name);
			playerSocket.on('startGameRequest', () => {
				start();
			});
			emitStartGame();
			return true;
		}else{
			emitStartGame();
			return false;
		}
	}

	function emitStartGame(){
		playersSockets.emit('canStartGame', (players.length >= 5));
	}

	const findPlayer = function(name){
		return _.find(players, ['name', name]);
	}

	const start = function(){
		// In the future you could start a tutorial
		console.log('players: ', players);
		assignRoles();
		selectRandomPresident();
		legislate();
	}

	function legislate(){
		const pres = findPlayer(president);
		pres.emit('chancellorCantidates', getChancellorCandidates());
		pres.on('chancellorChoice', (cName) => {
			const chance = findPlayer(cName);
			playersSockets.emit('voteOnCantidates', {
				president: pres.name,
				chancellor: chance.name
			});
			// Take in votes
		});
		// Ask president for chancellor
		// Vote on it
		// If it passes
			// Give president cards
			// He discards one
			// Give chancellor cards
			// He discards one
			// Enact it
			// If its hitler he wins
			// If power used use it
	}

	function getRoles(){
		return ['Hitler', 'Fascist', 'Liberal', 'Liberal', 'Liberal', 'Liberal', 'Facist', 'Liberal', 'Facist', 'Liberal']
			.slice(0, players.length);
	}

	function assignRoles(){
		const roles = getRoles();
		_.shuffle(players.map(e => e.name)).forEach((name, i) => {
			findPlayer(name).role = roles[i];
		});
		console.log('roles: ', roles);
	}

	function selectRandomPresident(){
		president = _.shuffle(players.map(e => e.name))[0];
	}

	function setNextPresident(){
		const index = players.indexOf(findPlayer(president));
		const nextPresIndex = index++;
		if(nextPresIndex > players.length) nextPresIndex = 0;
		lastPresident = president;
		lastChancellor = chancellor;
		president = players[nextPresIndex];
	}

	function getChancellorCandidates(){
		return players.map(e => e.name).filter(player => {
			if(player === lastPresident || player === lastChancellor) return false;
			return true;
		});
	}

	/* Return public methods */
	return {
		code: code,
		players: players,
		addPlayer: addPlayer,
		start: start
	}
}
