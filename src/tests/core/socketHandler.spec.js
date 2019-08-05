const { expect } = require('chai');
const socketIo = require('socket.io');
const ioClient = require('socket.io-client');
const Constants = require('../../constants');
const createServer = require('../../index');
const { socketHandler, connectedUsers } = require('../../core/socketHandler');

const server = createServer();
const io = socketIo(server);
const setupSockets = socketHandler.initialize(io);
const port = process.env.PORT || 5000;
const socketURL = `http://localhost:${port}`;
const options = { transports: ['websocket'] };

server.listen(port, () => {
  describe('core.socketHandler.initialize', () => {
    it('should initialize the socket handler', () => {
      expect(setupSockets).to.be.instanceof(socketIo);
    });
  });

  describe('core.socketHandler.connectedUsers', () => {
    it('should return the initial empty array of connected users', () => {
      expect(connectedUsers).to.be.instanceof(Array);
      expect(connectedUsers).to.have.length(0);
    });
  });

  describe('core.socketHandler.newUser', () => {
    it('should add a new user to the list of connected users, and get a connection call back', (done) => {
      const finalOptions = Object.assign(options, { query: 'name=UserOne' });
      const client = ioClient.connect(socketURL, finalOptions);

      client.on(`${Constants.SocketEvents.Connected}:UserOne`, () => {
        expect(connectedUsers).to.have.length(1);
        expect(connectedUsers[0]).to.equal('UserOne');

        client.disconnect();
        done();
      });
    });
  });

  describe('core.socketHandler.userList', () => {
    it('should add a new user to the list of connected users, and get the list of all users listening', (done) => {
      const finalOptions = Object.assign(options, { query: 'name=UserTwo' });
      const client = ioClient.connect(socketURL, finalOptions);

      client.on(Constants.SocketEvents.Users, (returnedUsers) => {
        expect(returnedUsers).to.eql(connectedUsers);

        client.disconnect();
        done();
      });
    });
  });

  describe('core.socketHandler.sendMessage', () => {
    it('should add a new user to the list of connected users, and send a message to all users', (done) => {
      const finalOptions = Object.assign(options, { query: 'name=UserThree' });
      const client = ioClient.connect(socketURL, finalOptions);

      client.on(`${Constants.SocketEvents.Connected}:UserThree`, () => {
        client.emit(Constants.SocketEvents.Message, { message: 'Hello World' });
      });

      client.on(Constants.SocketEvents.Message, (data) => {
        expect(data).to.eql({ message: 'Hello World', name: 'UserThree' });

        client.disconnect();
        done();
        server.removeAllListeners();
        server.close();
      });
    });
  });
});
