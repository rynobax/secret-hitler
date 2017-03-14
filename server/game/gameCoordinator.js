const Game = rootRequire('server/factories/game.js');
const _ = require('lodash');

let io = '';

const games = [];

const addGame = function(code, socket){
  const game = Game(code, socket, io)
  games.push(game);
}

const cleanGames = function(){
  games = games.filter(game => game.getPlayers().length > 0);
}

const getNewCode = function(){
  const len = 4;
  let code = '';
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Keep trying codes until we find a unique one
  do {
    code = '';
    for( let i=0; i < len; i++ ){
      code += possible.charAt(Math.floor(Math.random(1) * possible.length));
    }
  } while (!games.every(g => g.code != code));

  return code;
}

const getGame = function(code){
  return games[games.findIndex(g => g.code == code)];
}

const listen = function(_io, socket) {
	io = _io;
	// NEW GAME
	socket.on('newGameRequest', () => {
    // Get a unique code and send to the client
    const code = getNewCode();
    socket.emit('newGameResponse', code);
    addGame(code, socket);
  });

	// JOIN GAME
  socket.on('joinGameRequest', res => {
		const code = res.code;
		const name = res.name;
		const game = getGame(code);

		if(game == undefined){
			socket.emit('joinGameResponse', 'dne');
			return;
		}

		if(_.some(game.players, ['name', name])){
			socket.emit('joinGameResponse', 'repeatName');
			return;
		}

		let response = '';
		if(game.addPlayer(name, socket)){
			response = 'success';
		}else{
			response = 'full';
		}
		socket.emit('joinGameResponse', response);
  });
}
module.exports.listen = listen;
