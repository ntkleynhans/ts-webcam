import path from 'path'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'



const app = express();
const server = http.createServer(app)
const io = new Server(server)

const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

setInterval(() => {
  const options = {
    hostname: '127.0.0.1',
    port: 8080,
    path: '/',
    method: 'GET',
  };
  
  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
  
    res.on('data', data => {
      const message = JSON.parse(data)
      io.emit('image', message.data)
    });
  });
  
  req.on('error', error => {
    console.error(error);
  });
  
  req.end();
}, 1000)

server.listen(port, () => {
  console.log('listening on *:3000');
});
