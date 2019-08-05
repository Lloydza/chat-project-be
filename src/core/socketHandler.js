const Constants = require('../constants');

/*
*** DISCLAIMER ***
This is supposed to be a fast-built prototype!
In the real world, data (eg: connectedUsers) would be stored in a proper data-store.
*/

const socketHandler = {};
let io;
const connectedUsers = [];

socketHandler.initialize = (setIo) => {
  io = setIo;

  // Declare the unique identifier
  io.use((socket, next) => {
    // eslint-disable-next-line no-param-reassign
    socket.name = socket.request._query.name;
    next();
  });

  // New user connects
  io.on('connection', (socket) => {
    if (connectedUsers.indexOf(socket.name) === -1) {
      connectedUsers.push(socket.name);
    }

    io.emit(Constants.SocketEvents.Users, connectedUsers);
    io.emit(`${Constants.SocketEvents.Connected}:${socket.name}`, null);

    // Ping/ Pong. Used to maintain the connection state of the user
    // and also for online presence indicators.
    socket.on(Constants.SocketEvents.Hello, () => {
      io.emit(Constants.SocketEvents.OnlineStatus, socket.name);
    });

    socket.on(Constants.SocketEvents.Message, (data) => {
      const formattedData = {
        message: data.message,
        name: socket.name,
      };

      io.emit(Constants.SocketEvents.Message, formattedData);
    });

    // User starts typing
    socket.on(Constants.SocketEvents.TypingStatus, () => {
      io.emit(Constants.SocketEvents.TypingStatus, socket.name);
    });
  });

  return io;
};

module.exports = {
  socketHandler,
  connectedUsers,
};
