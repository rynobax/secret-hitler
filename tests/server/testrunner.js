global.io = require('socket.io-client');
const server = require('../../server.js');
const chai = require('chai');
chai.should();

const testPort = 9999;
global.socketURL = 'http://localhost:' + testPort;

global.options ={
  transports: ['websocket'],
  'force new connection': true
};

global.GC = null;

beforeEach(() => {
  GC = server.start(testPort);
});

describe('Secret Hitler', () => {
  describe('Host Join', () => {
    it('should allow the host to start a game', (done) => {
      const host = io.connect(socketURL, options);
      host.on('connect', () => {
        host.emit('newGameRequest', (data) => {
          data.should.have.property('success').that.equals(true);
          done();
        });
      });
    });
  });

  const playerJoin = require('./tests/playerJoin.js');
  describe('Player Join', playerJoin);
});