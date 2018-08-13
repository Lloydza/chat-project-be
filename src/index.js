const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const http = require('http');
const socketIo = require('socket.io');

const logger = require('./middleware/logger');
const { socketHandler } = require('./core/socketHandler');

function createServer() {
  const koaServer = new Koa();
  koaServer.use(logger);
  koaServer.use(bodyParser());

  const server = http.createServer(koaServer.callback());
  return server;
}

module.exports = createServer;

if (!module.parent) {
  const server = createServer();
  const io = socketIo(server);
  socketHandler.initialize(io);

  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`chat server listening on port: ${port}`);
  });
}
