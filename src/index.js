const app   = require('express')();
const http  = require('http').Server(app);
const io    = require('socket.io')(http);

const MESSAGE_TOPIC = 'iot-home-intruder';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on(MESSAGE_TOPIC, (message) => {
    console.log('=================');
    console.log(`received message: ${message}`);
    console.log('=================');

    socket.emit(MESSAGE_TOPIC, message);
  });
});

http.listen(3000, () => console.log('listening on *:3000'));