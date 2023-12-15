const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// 静的ファイルの提供（例えば、クライアントのHTMLファイル）
app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log("接続", __dirname + '/tell01.html');
  res.sendFile(__dirname + '/tell01.html');
});

// WebRTC関連の変数
let clients = {};

io.on('connection', socket => {

  // メッセージを受け取った時
  socket.on('message', (message) => {

    // 誰から送られたかわかるようにしておく
    message.from = socket.id;

    // 全員に送る
    socket.broadcast.emit("message", message);

  });

  // クライアントが接続を切断したとき
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    delete clients[socket.id];
  });

  // クライアントを管理
  clients[socket.id] = socket.id;
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
