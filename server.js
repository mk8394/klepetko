// Imports
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path');

const id = require('shortid');
const formatMessage = require("./client/helpers/messages");


// Server variables
const port = process.env.PORT || 3000;
const botName = "KlepetkoBot";
let users = {};
let ids = {}


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
        
        // Delete user reference
        delete users[ids[socket.id]];
        // Notify all, that user has disconnected
        socket.broadcast.emit('disconnected', ids[socket.id]);
        // Delete id reference
        delete ids[socket.id];

    });


    // Register
    socket.on('register', (user) => {

        // Generate id for a new user
        let user_id = id.generate();

        // Store user and id
        users[user_id] = user;
        ids[socket.id] = user_id;

        // Return id to player
        socket.emit('registerPlayer', user_id);

        // Spawn other users in your client
        for (let id in users) {
            if (id != user_id) {
                socket.emit('spawnUser', users[id], id);
            }
        };

        // Spawn your player in other clients
        socket.broadcast.emit('spawnUser', user, user_id);

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


// Start server
server.listen(port, () => {
    console.log('Server started on port ', port);
});