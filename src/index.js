'use strict';

const app   = require('express')();
const http  = require('http').Server(app);
const io    = require('socket.io')(http);

const MESSAGE_TOPIC = 'iot-home-intruder';

app.set('view engine', 'pug');

let test;

app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/index.html');
  res.render('index', {
    title: 'hey',
    img: {
      src: "image-stream.png"
    }
  });

  test = res;
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on(MESSAGE_TOPIC, (imageStream) => {
    console.log('=================');
    console.log(`received message:`);
    console.log('=================');

    // ==> I want to re-set img src in index.html
    test.render('index', {
      title: 'hey',
      img: {
        src: 'data:image/png;base64,' + imageStream
      }
    });

  });
});

http.listen(3000, () => console.log('listening on *:3000'));