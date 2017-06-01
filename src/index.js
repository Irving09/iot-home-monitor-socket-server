'use strict';

const app   = require('express')();
const cors  = require('cors');
const http  = require('http').Server(app);
const io    = require('socket.io')(http);
const iot   = require('aws-iot-device-sdk');

const MESSAGE_TOPIC = 'iot-home-intruder';
const UI_TOPIC = 'iot-home-intruder-ui';

const Device = iot.device(require('./credentials'));

app.set('view engine', 'pug');
app.use(cors());

app.get('/', (req, res) => {
  res.render('index', {
    title: 'IoT Home intruder socket server'
  });
});

app.put('/stream', function (req, res) {
  console.log('inside socket server');
  console.log(req);
  res.send({
    test: 'hello from socket server'
  });
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on(MESSAGE_TOPIC, function(imageStream) {
    socket.broadcast.emit(UI_TOPIC, imageStream);
  });

});

Device.on('connect', (err, data) => {
  if (err) throw err;
  console.log('iot-home-monitor successfully connected to AWS IoT Device Gateway');

  // Device.publish('start-stream', startStreaming);
});

http.listen(3000, () => console.log('listening on *:3000'));