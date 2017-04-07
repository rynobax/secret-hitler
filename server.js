/* Web Server */
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const http = require('http').Server(app);
const io = require('socket.io')(http);

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}
let publicDir = '/public';
if(process.env.NODE_ENV == 'DEV'){
  publicDir = '/src';
}

app.use(express.static(__dirname + publicDir));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

/* Angular App */
app.get('*', function(req, res, next) {
    res.sendfile('.'+publicDir+'/index.html');
});

const socketManager = rootRequire('server/sockets/socketManager.js');
socketManager.setIo(io);

/* Socket.io */
io.on('connection', socketManager.connect);

module.exports.start = function(port = 8080){
  http.listen(port, function(){
    console.log('listening on port ' + port);
  });
}