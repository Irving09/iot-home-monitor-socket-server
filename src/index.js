'use strict';

const app   = require('express')();
// const cors  = require('cors');
const http  = require('http').Server(app);
const io    = require('socket.io')(http);

const MESSAGE_TOPIC = 'iot-home-intruder';
const UI_TOPIC = 'iot-home-intruder-ui';

app.set('view engine', 'pug');
// app.use(cors());

app.get('/', (req, res) => {
  res.render('index', {
    title: 'IoT Home intruder socket server'
  });
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on(MESSAGE_TOPIC, function(imageStream) {
    socket.broadcast.emit(UI_TOPIC, imageStream);
  });

});

http.listen(3000, () => console.log('listening on *:3000'));