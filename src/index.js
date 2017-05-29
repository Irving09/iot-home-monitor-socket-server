'use strict';

const app   = require('express')();
const http  = require('http').Server(app);
const io    = require('socket.io')(http);

const MESSAGE_TOPIC = 'iot-home-intruder';
const UI_TOPIC = 'iot-home-intruder-ui';

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', {
    title: 'IoT Home intruder socket server'
  });
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on(MESSAGE_TOPIC, function(imageStream) {
    console.log('=================');
    console.log(`received message:`);
    console.log('=================');

    // TODO Emit imageStream to UI clients
    // Doesnt work
    console.log('socket.connected', socket.connected);
    socket.emit(UI_TOPIC, 'hello world');
  });

  // It works here
  socket.emit(UI_TOPIC, '====> hello world outside callback');
});

http.listen(3000, () => console.log('listening on *:3000'));