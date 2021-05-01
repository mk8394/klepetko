const express = require('express');
const app = express();

const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

const io = require('socket.io')(server);

const path = require('path');

app.use(express.static(path.join(__dirname, '/client')));

const id = require('shortid');

// let sockets = [];
let users = {};
let playerID;

const formatMessage = require("./client/messages");
const botName = "KlepetkoBot";

io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
        // delete sockets[playerID];
        delete users[playerID];
        // console.log(playerID);
        socket.broadcast.emit('disconnected', playerID);
        io.emit("message", formatMessage(botName, "Oseba [] je zapustila dvorišče."));
    });

    socket.on('register', (user) => {
        let user_id = id.generate();
        // sockets[user_id] = socket;
        users[user_id] = user;
        playerID = user_id;

        // Send player id
        socket.emit('registerPlayer', user_id);

        // socket.broadcast.emit('register', user, user_id);
        console.log(user);

        // Spawn other users in your client
        for(let id in users) {
            if(id != playerID) {
                socket.emit('spawnUser', users[id], id);
            }
        };

        // Spawn your player in other clients
        socket.broadcast.emit('spawnUser', user, user_id);
    });

    socket.emit('message', formatMessage(botName, "Dobrodošli v klepetku!"));
    // broadcast when a user connects
    socket.broadcast.emit("message", formatMessage(botName, "Oseba [] je prišla na dvorišče."));

    // socket.on('joinGame', (user) => {
    //     console.log('User joined: ', user);
        
    // });

    socket.on('playerPosition', (user_id, userVelocity, x, y) => {
        // console.log('Player is located at:', x, y);
 
        if(users[user_id]) {
            users[user_id].x = x;
            users[user_id].y = y;
            console.log(x, y);
        }
            
        
        socket.broadcast.emit('updatePosition', user_id, userVelocity);
    });

    // Listen for chatMessage
    socket.on("chatMessage", msg => {
        io.emit("message", formatMessage(playerID, msg));
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