const Constants = require('./constants');

/*
*** DISCLAIMER ***
This is supposed to be a fast-built prototype!
In the real world, data (eg: connectedUsers) would be stored in a proper store.
*/

let socketHandler = {};
let io;
let connectedUsers = [];

socketHandler.initialize = (setIo) => {
  io = setIo;

  // Declare the unique identifier
  io.use(function(socket, next) {
    socket.name = socket.request._query['name'];
    next();
  });

  // New user connects
  io.on('connection', (socket) => {

    if (connectedUsers.indexOf(socket.name) === -1) {
      connectedUsers.push(socket.name);
    }
    
    io.emit(Constants.SocketEvents.Users, connectedUsers);
    io.emit(Constants.SocketEvents.Connected + ":" + socket.name, null);

    // Ping/ Pong. Used to maintain the connection state of the user and also for online presence indicators.
    socket.on(Constants.SocketEvents.Hello, (data) => {
      io.emit(Constants.SocketEvents.OnlineStatus, socket.name);
    });

    socket.on(Constants.SocketEvents.Message, (data) => {
      const formattedData = {
        message: data.message,
        name: socket.name
      };

      io.emit(Constants.SocketEvents.Message, formattedData);
    });

    // User starts typing
    socket.on(Constants.SocketEvents.TypingStatus, (data) => {
      io.emit(Constants.SocketEvents.TypingStatus, socket.name);
    });

  });
};

module.exports = socketHandler;
