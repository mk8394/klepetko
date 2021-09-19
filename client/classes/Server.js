// Class for communication with the server
// This class is to be used by the player

export default class Server {
    constructor(socket) {
        this.socket = socket;
    }

    register(user) {
        this.socket.emit('register', user, user.room);
    }

    joinGame(user) {
        this.socket.emit('joinGame', user);
    }

    playerPosition(id, playerVelocity, x, y, skinNUM) {
        this.socket.emit('playerPosition', id, playerVelocity, x, y, skinNUM);
    }

    changeRoom(id, newRoom) {
        this.socket.emit('changeRoom', id, newRoom);
    }
}