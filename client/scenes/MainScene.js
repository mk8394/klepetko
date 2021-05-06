// Schoolyard scene (Main Scene)
import Player from '../classes/Player.js';
import Message from '../classes/Message.js';
const socket = io('http://localhost:3000');

const message = new Message();

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');

        // Storage of all active users
        this.users = {};
    }

    init(data) {
        // Get data from login
        this.playerName = data.username;
    }

    preload() {

        Player.preload(this);
        this.load.image('outside', 'assets/outside.png');


        // Socket.io events on client

        // Register
        socket.on('registerPlayer', (id, instance) => {
            this.player.id = id;
            this.player.room.instance = instance;
            this.users[this.player.id] = this.player;
        });

        // Spawn other users
        socket.on('spawnUser', (user, user_id) => {
            console.log(user, this.player);
            if(user.room.instance == this.player.room.instance) {
                this.spawnUser(user, user_id);
            }
        });

        // Disconnect a user
        socket.on('disconnected', (user_id) => {
            if (this.users[user_id]) {
                this.users[user_id].remove();
                delete this.users[user_id];
            }
        });

        // Update position of users
        socket.on('updatePosition', (id, userVelocity, x, y) => {
            if (this.users[id]) {
                this.users[id].updateUser(this.users[id], userVelocity, x, y)
            }
        });

        // Message recieve
        socket.on("message", msg => {
            message.outputMessage(msg, this.users[msg.id]);
            message.scrollToTop();
        });

        // Message send
        message.chatForm.addEventListener("submit", e => {
            e.preventDefault();

            // Get message text
            const msg = e.target.elements.msg.value;

            // Send message to server
            socket.emit("chatMessage", this.player.id, msg);

            // Clear input
            e.target.elements.msg.value = "";
            // e.target.elements.msg.focus();
            e.target.elements.msg.blur();
        });

    }

    create() {

        // Display background image
        this.createBackground();

        // Set roomid and instance
        let room = {
            id: '1',
            instance: null // Defined by server, depending if the room is full
        }

        // Create a player game object
        this.player = new Player({
            scene: this,
            x: 400,
            y: 300,
            texture: 'player',
            frame: '3',
        }, socket, null, this.playerName, room);

        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        }, false);

        // Prevent rotation
        this.matter.body.setInertia(this.player.body, Infinity);
        this.player.setFriction(0);

        // Disable collision between players
        this.player.body.collisionFilter.group = -1;

        // Set objet name (helps with username)
        this.player.name = this.playerName;

        // Register new player to the server
        this.player.server.register(this.player);

        // Create collision events
        this.createCollisionEvents();

        this.add.text(600, 400, 'room ' + room.id)

    }

    createBackground() {
        this.add.image(400, 451 / 2, 'outside');

        this.schoolEntrance = this.matter.add.rectangle(400, 110, 100, 50, 0xff0000, 1);
        this.schoolEntrance.isStatic = true;
        this.schoolEntranceBorder = this.matter.add.rectangle(400, 110, 120, 70, 0xff0000, 1);
        this.schoolEntranceBorder.isStatic = true;
    }

    createCollisionEvents() {
        let pair = {
            bodyA: this.schoolEntrance,
            bodyB: this.player.body
        }

        this.schoolEntrance.onCollideCallback = () => {
            this.enterText = this.add.text(400, 100, 'Pritisni E za vstop v šolo');
            this.input.keyboard.on('keydown_E', () => this.enterSchool(), this);
        };

        this.schoolEntrance.onCollideEndCallback = () => {
            this.enterText.destroy();
            this.input.keyboard.removeAllListeners('keydown_E');
        }


        this.quizEnterance = this.matter.add.rectangle(0, 110, 100, 50, 0x000000, 1);
        this.quizEnterance.isStatic = true;
        this.quizEnteranceBorder = this.matter.add.rectangle(0, 110, 120, 70, 0x000000, 1);
        this.quizEnteranceBorder.isStatic = true;

        this.quizEnterance.onCollideCallback = () => {
            this.enterText = this.add.text(0, 100, 'Pritisni E za poskus kviza');
            console.log('smo v kvizu');
            this.input.keyboard.on('keydown_E', ()=>this.enterQuiz(), this);
        }
        
        this.quizEnterance.onCollideEndCallback = () => {
            this.enterText.destroy();
            console.log('oddaljujem se od kviza');
            this.input.keyboard.removeAllListeners('keydown_E');
        }
    }

    update() {
        this.player.update();

        // Disable movement while typing (may get removed for efficency)
        if(message.input === document.activeElement) {
            this.input.keyboard.enabled = false;
        } else {
            this.input.keyboard.enabled = true;
        }
    }

    // Spawn other users
    spawnUser(user, user_id) {

        let newUser = new Player({
            scene: this,
            x: user.x,
            y: user.y,
            texture: 'player',
            frame: user.frame
        }, socket, user_id, user.name, user.room);

        // Prevent rotation
        this.matter.body.setInertia(newUser.body, Infinity);
        newUser.setFriction(0);

        // Disable collision between players
        newUser.body.collisionFilter.group = -1;

        // newUser.server.joinGame(newUser);
        this.users[user_id] = newUser;

    }

    enterSchool() {
        // console.log('enter');
        this.scene.start('HallwayScene');
        this.player.destroy();
    }

    enterQuiz() {
        var chat = document.getElementById("chat");
        chat.style.display = "none";
        var game = document.getElementById("game");
        game.style.display = "none";
        var quiz = document.getElementById("quiz");
        quiz.style.display = "block";
    }

}

