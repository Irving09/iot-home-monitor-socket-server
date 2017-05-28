const app   = require('express')();
const http  = require('http').Server(app);
const io    = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('add-message', (message) => {
  console.log('=================');
  console.log('this is server-side');
  console.log(`received message from client side: ${message}`);
  console.log('=================');

  socket.emit('add-message', 'inno-server was here dough');
  });
});

http.listen(3000, () => console.log('listening on *:3000'));