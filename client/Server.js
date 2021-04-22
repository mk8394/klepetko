export default class Server {
    constructor(socket) {
        this.socket = socket;
    }

    register(user) {
        this.socket.emit('register', user);
    }

    joinGame(user) {
        this.socket.emit('joinGame', user);
    }

    playerPosition(x, y) {
        this.socket.emit('playerPosition', x, y);
    }
}