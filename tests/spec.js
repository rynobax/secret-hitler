// spec.js
const server = require('../server.js');
const simulate = require('./simulateGame');

beforeAll(function(done) {
  server.start('7171');
  done();
});

describe('Secret Hitler', () => {
  it('should have a title', () => {
    browser.get('http://localhost:7171');

    expect(browser.getTitle()).toEqual('Secret Hitler');
  });

  it('Can play a game', simulate.simulateGame.bind(null, 5));
});
