'use strict';

const app         = require('express')();
const cors        = require('cors');
const http        = require('http').Server(app);
const io          = require('socket.io')(http);
const iot         = require('aws-iot-device-sdk');

const MESSAGE_TOPIC = 'iot-home-intruder';
const UI_TOPIC = 'iot-home-intruder-ui';

const Device = iot.device(require('./credentials'));

let connectedToAwsIoT = false;

app.set('view engine', 'pug');
app.use(cors());

app.get('/', (req, res) => {
  res.render('index', {
    title: 'IoT Home intruder socket server'
  });
});

app.put('/stream', function (req, res) {
  console.log('received request to start/stop the stream: ', req.query['start']);

  if (connectedToAwsIoT) {
    Device.publish('start-stream', JSON.stringify({
      streamEnabled: req.query['start']
    }));
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

  socket.on(MESSAGE_TOPIC, function(imageStream) {
    socket.broadcast.emit(UI_TOPIC, imageStream);
  });

});

Device.on('connect', (err, data) => {
  if (err) throw err;
  console.log('iot-home-monitor successfully connected to AWS IoT Device Gateway');

  connectedToAwsIoT = true;
});

http.listen(3000, () => console.log('listening on *:3000'));