const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const port = 3000;

const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static('client'));

// Client handling
const Player = require('./client/Classes/Player');

let sockets = [];
let players = [];

io.on('connection', (socket) => {
    console.log('A user has connected.');

    let player = new Player('undefined');
    sockets[player.id] = socket;
    players[player.id] = player;

    socket.on('register', (username) => {
        player.username = username;
        console.log(`${player.username} has joned the game.`);

        socket.emit('spawn', player);
        socket.broadcast.emit('spawn', player);
        for (playerID in players) {
            if (playerID != player.id) {
                socket.emit('spawn', players[playerID]);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log(`${player.username} has left the game`);

        delete sockets[player.id];
        delete players[player.id];
    });
});

setInterval (() => {
    for(let i in players) {
        let socket = sockets[i];
        // let updatePosition = {
        //     "playerID": players[i].id,
        //     "playerPOS": players[i].position
        // }
        socket.emit('updatePosition', players[i]);
    }
}, 1000/25);

server.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});