module.exports = () => {
    let code;
    beforeEach((done) => {
      const host = io.connect(socketURL, options);
      host.on('connect', () => {
        host.emit('newGameRequest', (data) => {
          code = data.state.code;
          done();
        });
      });
    });

    it('can join', (done) => {
      const playerCount = 5;
      const players = [];
      for(let i = 0; i<playerCount; i++){
        const name = 'player'+i;
        const socket = io.connect(socketURL, options);
        players.push({
          name: name,
          socket: socket
        });
      }
      Promise.all(players.map(({socket, name}) => {
        return new Promise((resolve, reject) => {
          socket.emit('joinGameRequest', {
            name: name,
            code: code
          }, (data) => {
            data.should.have.property('result').that.equals('success');
            resolve();
          })
        });
      }))
      .then(() => done());
    });

    it('does not accept >10 players', (done) => {
      const playerCount = 11;
      const players = [];
      for(let i = 0; i<playerCount; i++){
        const name = 'player'+i;
        const socket = io.connect(socketURL, options);
        players.push({
          name: name,
          socket: socket
        });
      }
      Promise.all(players.map(({socket, name}) => {
        return new Promise((resolve, reject) => {
          socket.emit('joinGameRequest', {
            name: name,
            code: code
          }, (data) => {
            resolve(data.result);
          })
        });
      }))
      .then((arr) => {
        arr.some(e => e == 'full').should.equal(true);
        done();
      });
    });
}