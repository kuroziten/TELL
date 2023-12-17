const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

let clients = {};
io.on('connection', socket => {
  socket.on('message', (message) => {
    message.from = socket.id;
    socket.broadcast.emit("message", message);
  });
  socket.on('tomessage', (socketId, message) => {
    message.from = socket.id;
    socket.to(socketId).emit("message", message);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    delete clients[socket.id];
  });
  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });
  clients[socket.id] = socket.id;
});

const PORT = 3000;
server.listen(PORT);
