const express = require('express');
const app = express();

const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

const io = require('socket.io')(server);

const path = require('path');

app.use(express.static(path.join(__dirname, '/client')));

const id = require('shortid');

let sockets = [];
let users = [];
let playerID;

io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
        delete sockets[playerID];
        delete users[playerID];
        console.log(playerID);
        socket.broadcast.emit('disconnected', playerID);
    });

    socket.on('register', (user) => {
        let user_id = id.generate();
        sockets[user_id] = socket;
        users[user_id] = user;
        playerID = user_id;
        socket.emit('registerPlayer', user_id);
        // socket.broadcast.emit('register', user, user_id);
        socket.broadcast.emit('spawnUser', user, user_id);
    });

    // socket.on('joinGame', (user) => {
    //     console.log('User joined: ', user);
        
    // });

    socket.on('playerPosition', (x, y) => {
        // console.log('Player is located at:', x, y);
    });

});

// setInterval(() => {
//     for(let i in sockets) {
//         let socket = sockets[i];
//         socket.emit('updatePosition', user);
//     }
// }, 1000 / 25)

server.listen(port, () => {
    console.log('listening on port', port);
});