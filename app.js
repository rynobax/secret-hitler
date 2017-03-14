const server = require('./server.js');
const args = process.argv.slice(2);
server.start(args[0]); 