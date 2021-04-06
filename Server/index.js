const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { pingInterval: 500 });

let ChatData = require('./Classes/ChatData');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    console.log('A user connected.');

    // Recieve chat message
    socket.on('chat', (msg) => {
        console.log("Recieved message: " + msg);
        let msgData = new ChatData(msg);
        socket.emit('chat', msgData);
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });

});

http.listen(3000, () => {
    console.log('Server running on port 3000.');
});