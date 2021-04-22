import Player from './Player.js';
const socket = io('http://localhost:3000');
const users = [];

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        Player.preload(this);
        this.load.image('outside', 'assets/outside.png');

        socket.on('registerPlayer', (id) => {
            this.player.id = id;
        });

        // socket.on('register', (user, id) => {
        //     user.id = id;
        //     users[id] = user;
        // });

        socket.on('spawnUser', (user) => {
            console.log(users);
            if(!users[user.id]) {
                users[user.id] = user;
                this.spawnUser(user);
            }
        });

        socket.on('disconnected', (user_id) => {
            delete users[user_id];
        });
    }
    
    create() {
        this.add.image(400, 451/2, 'outside');
        this.player = new Player({scene: this, x: 0, y: 0, texture: 'player', frame: '3'}, socket, null);
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.player.server.register(this.player);
    }

    update() {
        users.forEach((user) => {
            user.update();
        });
    }

    spawnUser(user, user_id) {
        let newUser = new Player({scene: this, x: 0, y: 0, texture: 'player', frame: '3'}, socket, user_id);
        // newUser.server.joinGame(newUser);
        // users.push(newUser);
        users[user_id] = newUser;
    }
}