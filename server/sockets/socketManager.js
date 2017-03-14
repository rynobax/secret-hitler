const gameCoordinator = rootRequire('server/game/gameCoordinator.js');
const _ = require('lodash');
let io = {};

module.exports.connect = function(socket){
  socket.on('disconnect', () => {
  });

	// Set listeners for the game
	gameCoordinator.listen(io, socket);
}


module.exports.setIo = function(_io){
	io = _io;
}
