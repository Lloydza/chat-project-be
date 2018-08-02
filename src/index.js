const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const logger = require('./middleware/logger');
const cors = require('./middleware/cors');
const socketHandler = require('./socketHandler');

app.use(logger);
app.use(cors);
app.use(bodyParser.json({limit: '5mb'}));

socketHandler.initialize(io);

const port = process.env.PORT || 5000;
http.listen(port, function(){
	console.log('chat server listening on port: ' + port);
});
