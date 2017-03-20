const Game = rootRequire('server/factories/game.js');
const _ = require('lodash');

let io = '';

const games = [];

const addGame = function(socket){
  const game = Game(getNewCode(), socket, io)
  games.push(game);
  return game;
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

function getExistingGame(socket){
  const newIP = socket.request.connection.remoteAddress;
  return games.find(game => {
    const hostIP = game.host.request.connection.remoteAddress;
    return newIP == hostIP;
  });
}

const listen = function(_io, socket) {
	io = _io;
	// NEW GAME
	socket.on('newGameRequest', () => {
    // Get a unique code and send to the client
    let game = getExistingGame(socket);
    if(game === undefined){
      game = addGame(socket);
    }
    socket.emit('newGameResponse', {success: true, state: game.getState()});
  });

	// JOIN GAME
  socket.on('joinGameRequest', res => {
		const code = res.code;
		const name = res.name;
		const game = getGame(code);

		if(game == undefined){
			socket.emit('joinGameResponse', {result: 'dne'});
			return;
		}

    const existingPlayer = _.find(game.players, ['name', name]);
		if(!!existingPlayer){
      if(existingPlayer.socket.connected){
        socket.emit('joinGameResponse', {result: 'repeatName'});
      }else{
        socket.emit('joinGameResponse', {result: 'success', state: game.getState()});
      }
		}else{
      let response = '';
      if(game.addPlayer(name, socket)){
        socket.emit('joinGameResponse', {result: 'success', state: game.getState()});
      }else{
        socket.emit('joinGameResponse', {result: 'full'});
      }
    }
  });
}
module.exports.listen = listen;
