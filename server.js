const express = require('express');
const app = express();

const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

const io = require('socket.io')(server);

const path = require('path');

app.use(express.static(path.join(__dirname, '/client')));

io.on('connection', (socket) => {
    console.log('A user connected.');
});

server.listen(port, () => {
    console.log('listening on port', port);
});