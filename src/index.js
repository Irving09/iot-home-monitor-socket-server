'use strict';

const app   = require('express')();
const http  = require('http').Server(app);
const io    = require('socket.io')(http);

const MESSAGE_TOPIC = 'iot-home-intruder';
const UI_TOPIC = 'iot-home-intruder-ui';

app.set('view engine', 'pug');

let test;

app.get('/', (req, res) => {
  res.render('index', {
    title: 'IoT Home intruder socket server'
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on(MESSAGE_TOPIC, (imageStream) => {
    console.log('=================');
    console.log(`received message:`);
    console.log('=================');

    // TODO Emit imageStream to UI clients
    socket.emit(UI_TOPIC, imageStream);
  });
});

http.listen(3000, () => console.log('listening on *:3000'));