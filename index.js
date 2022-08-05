"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const opencv4nodejs_1 = __importDefault(require("opencv4nodejs"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const wCap = new opencv4nodejs_1.default.VideoCapture(0);
const port = 3000;
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'index.html'));
});
io.on('connection', (socket) => {
    console.log('a user connected');
});
setInterval(() => {
    const frame = wCap.read();
    const image = opencv4nodejs_1.default.imencode('.jpg', frame).toString('base64');
    io.emit('image', image);
}, 1000);
server.listen(port, () => {
    console.log('listening on *:3000');
});
