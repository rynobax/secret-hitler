module.exports = function(name, socket){
  return {
    name: name,
		socket: socket,
    role: '',
    alive: true,
    awaitingVote: false,
    vote: ''
  }
}
