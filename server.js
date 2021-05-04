// Imports
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path');

const id = require('shortid');
const { DefaultDeserializer } = require('v8');
const formatMessage = require("./client/helpers/messages");
const instance = require("./client/helpers/instance");


// Server variables
const port = process.env.PORT || 3000;
const botName = "KlepetkoBot";
let users = {};
let ids = {};
let rooms = {
    r1: [0, 0, 0, 0, 0],
    r2: [0, 0, 0, 0, 0]
};
let maxPlayersInRoom = 10;


// Server setup
app.use(express.static(path.join(__dirname, '/client')));


// Socket.io events
io.on('connection', (socket) => {

    // Server announcer
    console.log('User connected with id:', socket.id);


    // Disconnection
    socket.on('disconnect', () => {

        // Server announcer
        console.log('User disconnected.', socket.id, 'deleted from cache.');

        // Chat announcer
        if(users[ids[socket.id]]) {
            io.emit("message", formatMessage(botName, `Oseba ${users[ids[socket.id]].name} je zapustila igro.`));
        }

        // Free space in instance
        if(users[ids[socket.id]]) {
            freeInstanceSpace(users[ids[socket.id]].room);
        }
        // Delete user reference
        delete users[ids[socket.id]];
        // Notify all, that user has disconnected
        socket.broadcast.emit('disconnected', ids[socket.id]);
        // Delete id reference
        delete ids[socket.id];

    });


    // Register
    socket.on('register', (user, room) => {

        // Generate id for a new user
        let user_id = id.generate();

        // Store user, id and room/instance
        users[user_id] = user;
        ids[socket.id] = user_id;
        users[user_id].room = room;

        setInstance(Number(room.id), user_id);

        console.log(users[user_id]);

        // Return id to player
        socket.emit('registerPlayer', user_id, users[user_id].room.instance);

        // Spawn other users in your client
        for (let id in users) {
            console.log(users);
            if (id != user_id && users[id].room.id == users[user_id].room.id && users[id].room.instance == users[user_id].room.instance) {
                socket.emit('spawnUser', users[id], id);
            }
        };

        // Spawn your player in other clients
        socket.broadcast.emit('spawnUser', users[user_id], user_id);

        // Message announcer for connection
        socket.emit('message', formatMessage(botName, 'Dobrodošli v klepetku!'));
        socket.broadcast.emit('message', formatMessage(botName, `Oseba ${user.name} je prišla na dvorišče.`));

    });


    // Update player position
    socket.on('playerPosition', (user_id, userVelocity, x, y) => {

        // Store user coordinates
        if (users[user_id]) {
            users[user_id].x = x;
            users[user_id].y = y;
        }

        // Send player position to other clients
        socket.broadcast.emit('updatePosition', user_id, userVelocity, x, y);

    });

    // Chat message
    socket.on("chatMessage", (user_id, msg) => {

        // Send message to all clients
        io.emit("message", formatMessage(users[user_id].name, msg, user_id));

    });

});

const setInstance = (id, user_id) => {
    switch(id) {
        case 1: {
            for(let i = 0; i < rooms.r1.length; i++) {
                if(rooms.r1[i] < maxPlayersInRoom) {
                    users[user_id].room.instance = i;
                    rooms.r1[i]++;
                    break;
                }
            }
            break;
        }
        case 2: {
            for(let i = 0; i < rooms.r2.length; i++) {
                if(rooms.r2[i] < maxPlayersInRoom) {
                    users[user_id].room.instance = i;
                    rooms.r2[i]++;
                    break;
                }
            }
            break;
        }
    }
}

async function freeInstanceSpace (room) {
    console.log(room);
    switch(Number(room.id)) {
        case 1: {
            rooms.r1[room.instance]--;
            break;
        }
        case 2: {
            rooms.r2[room.instance]--;
            break;
        }
    }
}


// Start server
server.listen(port, () => {
    console.log('Server started on port', port);
});