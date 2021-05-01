import Player from './Player.js';
const socket = io('http://localhost:3000');

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.users = {};
    }

    init(data) {
        this.playerName = data.username;
        console.log(data.username);
    }

    preload() {
        Player.preload(this);
        this.load.image('outside', 'assets/outside.png');


        // Defining events on client

        socket.on('registerPlayer', (id) => {
            this.player.id = id;
            this.users[this.player.id] = this.player;
            console.log('your player id is ', id);
        });

        // socket.on('register', (user, id) => {
        //     user.id = id;
        //     users[id] = user;
        // });

        socket.on('spawnUser', (user, user_id) => {
            this.spawnUser(user, user_id);
        });

        socket.on('disconnected', (user_id) => {
            console.log('a  user disconnected');
            if(this.player.id == user_id)
                console.log('this is the player, dont delete');
            else if (this.users[user_id]) {
                this.users[user_id].remove();
                delete this.users[user_id];
            }
            console.log('deleted user with id ', user_id)
        });


        socket.on('updatePosition', (id, userVelocity, x, y) => {
            if (this.users[id]) {
                // this.users[id].setVelocity(userVelocity.x, userVelocity.y);
                this.users[id].x = x;
                this.users[id].y = y;
            }
        });
    }

    create() {
        this.add.image(400, 451 / 2, 'outside');
        this.player = new Player({
            scene: this,
            x: 400,
            y: 300,
            texture: 'player',
            frame: '3'
        }, socket, null, this.playerName);

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Prevent rotation
        this.matter.body.setInertia(this.player.body, Infinity);
        this.player.setFriction(0);
        // Disable collision between players
        this.player.body.collisionFilter.group = -1;
        this.player.name = this.playerName;

        console.log(this.player);
        this.player.server.register(this.player);
    }

    update() {
        this.player.update();
        // console.log(this.users);
        // for(let id in this.users) {
        //     // console.log(this.users[id]);
        //     if(id != this.player.id){
        //         this.users[id].updateUsers(this.users[id].x, this.users[id].y);
        //     }
        // };
    }

    spawnUser(user, user_id) {
        console.log(user);
        let newUser = new Player({
            scene: this,
            x: user.x,
            y: user.y,
            texture: 'player',
            frame: user.frame
        }, socket, user_id, user.username);

        // Prevent rotation
        this.matter.body.setInertia(newUser.body, Infinity);
        newUser.setFriction(0);
        // Disable collision between players
        newUser.body.collisionFilter.group = -1;

        // newUser.server.joinGame(newUser);
        this.users[user_id] = newUser;
        console.log(this.users);
    }
}

socket.on("message", message => {
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", e => {
    e.preventDefault();

    // get message text
    const msg = e.target.elements.msg.value;

    // emit message to server
    socket.emit("chatMessage", msg);

    // clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
        ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}