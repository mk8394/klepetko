// Schoolyard scene (Main Scene)

import Player from '../classes/Player.js';
export const socket = io('http://localhost:3000');

import { setSocketEvents, removeSocketEvents } from '../helpers/socketEvents.js'
import { users, message, spawnPlayer, spawnOtherUser, playerData, changeRoom } from '../helpers/clientData.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');   
    }

    init(data) {
        // Get data from login
        if(data.username) {
            console.log('there is data');
            this.playerName = data.username;
        } else if(data.player) {
            console.log('entering');
            this.playerName = data.player.usernameText;
            data.player.server.changeRoom(playerData.id, 1);
        }
    }

    preload() {
        Player.preload(this);
        this.load.image('outside', 'assets/outside.png');
        setSocketEvents(this);
    }

    create() {
        this.createBackground();
        spawnPlayer(this);
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
        if (this.message.input === document.activeElement) {
            this.input.keyboard.enabled = false;
        } else {
            this.input.keyboard.enabled = true;
        }
    }

    // Spawn other users
    spawnUser(user, user_id) {
        spawnOtherUser(user, user_id, this);
    };

    enterSchool() {
        console.log('before leave', users);

        changeRoom(1, 2, this);
        
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

