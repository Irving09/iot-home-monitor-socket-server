'use strict';

const app         = require('express')();
const cors        = require('cors');
const http        = require('http').Server(app);
const io          = require('socket.io')(http);
const iot         = require('aws-iot-device-sdk');

const MESSAGE_TOPIC = 'iot-home-intruder';
const UI_TOPIC = 'iot-home-intruder-ui';
const RPI_TOPIC = 'iot-home-intruder-start-stream';

let Socket;

app.set('view engine', 'pug');
app.use(cors());

app.get('/', (req, res) => {
  res.render('index', {
    title: 'IoT Home intruder socket server'
  });
});

app.put('/stream', function (req, res) {
  console.log('received request to start/stop the stream: ', req.query['start']);

  if (Socket) {
    console.log('emitting query to start the stream...');
    Socket.broadcast.emit(RPI_TOPIC, req.query['start']);
    res.json({
      message: 'iot-home-monitor streaming started'
    });
  } else {
    console.log('Server still not connected to AWS IoT. ' +
      'Please wait a for a few moment before you cans tart streaming.' +
      'Or check the credentials in server to make sure it is valid with registered thing in AWS IoT.');
  }
});

io.on('connection', function(socket) {
  console.log('a user connected');

  Socket = socket;

  socket.on(MESSAGE_TOPIC, function(imageStream) {
    socket.broadcast.emit(UI_TOPIC, imageStream);
  });

});

http.listen(3000, () => console.log('listening on *:3000'));