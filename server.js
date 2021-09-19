// Imports
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path');

const id = require('shortid');
const { DefaultDeserializer } = require('v8');
const formatMessage = require("./client/helpers/messages");


// Server variables
const port = process.env.PORT || 3000;
const botName = "KlepetkoBot";
let users = {};
let ids = {};
const rooms = {
    r1: [0, 0, 0, 0, 0],
    r2: [0, 0, 0, 0, 0],
    r3: [0, 0, 0, 0, 0],
    r4: [0, 0, 0, 0, 0]
}
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
        if (users[ids[socket.id]]) {
            socket.to(users[ids[socket.id]].roomName).emit("message", formatMessage(botName, `Oseba ${users[ids[socket.id]].name} je zapustila igro.`));
            // Leave room
            leaveRoom(socket, users[ids[socket.id]].roomName);
        }

        // Delete user reference
        delete users[ids[socket.id]];
        // Notify all, that user has disconnected
        socket.broadcast.emit('disconnected', ids[socket.id]);
        // Delete id reference
        delete ids[socket.id];

    });


    // Register
    socket.on('register', (user) => {

        let roomName = getRoomName(1);

        socket.join(roomName);

        // Generate id for a new user
        let user_id = id.generate();

        // Store user, id and room/instance
        users[user_id] = user;
        ids[socket.id] = user_id;
        users[user_id].roomName = roomName;

        // Return id to player
        socket.emit('registerPlayer', user_id);

        // Spawn other users in your client
        for (let id in users) {

            if (id != user_id && users[id].roomName == users[user_id].roomName) {
                socket.emit('spawnUser', users[id], id);
            }
        };

        // Spawn your player in other clients
        socket.to(users[user_id].roomName).emit('spawnUser', users[user_id], user_id);

        // Message announcer for connection
        socket.emit('message', formatMessage(botName, 'Dobrodošli v klepetku!'));
        socket.to(users[user_id].roomName).emit('message', formatMessage(botName, `Oseba ${user.name} je prišla na dvorišče.`));

    });


    // Update player position
    socket.on('playerPosition', (user_id, userVelocity, x, y, skinNUM) => {
        
        // Store user coordinates
        if (users[user_id]) {
            users[user_id].x = x;
            users[user_id].y = y;

            // Send player position to other clients
            socket.to(users[user_id].roomName).emit('updatePosition', user_id, userVelocity, x, y, skinNUM);
        }

    });

    // Chat message
    socket.on("chatMessage", (user_id, msg) => {

        // Send message to all clients
        socket.emit("message_player", formatMessage(users[user_id].name, msg, user_id));
        socket.to(users[user_id].roomName).emit("message", formatMessage(users[user_id].name, msg, user_id));
        
    });

    // Changing room
    socket.on('changeRoom', async (user_id, newRoom) => {
        socket.to(users[user_id].roomName).emit('leaveRoom', user_id);
        leaveRoom(socket, users[user_id].roomName);
        newRoomSpawn(socket, user_id, newRoom);
    });

});

const getRoomName = (id) => {
    let roomName = '';

    switch (id) {
        case 1: {
            for (let i = 0; i < rooms.r1.length; i++) {
                if (rooms.r1[i] < maxPlayersInRoom) {
                    roomName = `${id}-${i}`;
                    rooms.r1[i]++;
                    break;
                }
            }
            break;
        }
        case 2: {
            for (let i = 0; i < rooms.r2.length; i++) {
                if (rooms.r2[i] < maxPlayersInRoom) {
                    roomName = `${id}-${i}`;
                    rooms.r2[i]++;
                    break;
                }
            }
            break;
        }
        case 3: {
            for (let i = 0; i < rooms.r3.length; i++) {
                if (rooms.r3[i] < maxPlayersInRoom) {
                    roomName = `${id}-${i}`;
                    rooms.r3[i]++;
                    break;
                }
            }
            break;
        }
        case 4: {
            for (let i = 0; i < rooms.r4.length; i++) {
                if (rooms.r4[i] < maxPlayersInRoom) {
                    roomName = `${id}-${i}`;
                    rooms.r4[i]++;
                    break;
                }
            }
            break;
        }
    }
    return roomName;
}

const newRoomSpawn = async (socket, user_id, newRoom) => {

    users[user_id].roomName = getRoomName(newRoom);
    socket.join(users[user_id].roomName);

    // Spawn other users in your client
    for (let id in users) {

        if (id != user_id && users[id].roomName == users[user_id].roomName) {
            socket.emit('spawnUser', users[id], id);
        }
    };
    // Spawn your player in other clients
    socket.to(users[user_id].roomName).emit('spawnUser', users[user_id], user_id);

}

const leaveRoom = (socket, roomName) => {
    let roomID = Number(roomName[0]);
    let roomIns = Number(roomName[2]);

    socket.leave(roomName);

    switch (roomID) {
        case 1: {
            rooms.r1[roomIns]--;
            break;
        }
        case 2: {
            rooms.r2[roomIns]--;
            break;
        }
        case 3: {
            rooms.r3[roomIns]--;
            break;
        }
        case 4: {
            rooms.r4[roomIns]--;
            break;
        }
    }
}

// Start server
server.listen(port, () => {
    console.log('Server started on port', port);
});