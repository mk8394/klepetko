// Classroom scene

import Player from '../classes/Player.js';
import { socket } from './MainScene.js';

import { setSocketEvents, removeSocketEvents } from '../helpers/socketEvents.js'
import { users, message, spawnPlayer, spawnOtherUser, playerData, changeRoom, gameData, setBounds, createHUD } from '../helpers/clientData.js';

export default class ClassroomScene extends Phaser.Scene {
    constructor() {
        super('ClassroomScene');
    }

    init(data) {
        this.playerName = data.player.usernameText;
        data.player.server.changeRoom(playerData.id, 3);
        this.playerSpawn = {
            x: 1620,
            y: gameData.height/2 - 100
        }
        this.skinNUM = data.player.skinNUM;
    }

    preload() {
        Player.preload(this);
        this.load.image('Classroom', 'assets/Rooms/Classroom.png');
        setSocketEvents(this);
    }

    create() {
        createHUD(this);
        setBounds(this);
        this.createBackground();
        spawnPlayer(this);
    }

    createBackground() {
        
        this.add.image(gameData.width / 2, 490, 'Classroom');
        this.add.text(0, 0, 'Classroom');

        this.classroomExit = this.matter.add.rectangle(gameData.width-80, gameData.height/2-60, 50, 100, 0xff0000, 1);
        this.classroomExit.isStatic = true;
        this.classroomExitBorder = this.matter.add.rectangle(gameData.width-80, gameData.height/2-60, 70, 120, 0xff0000, 1);
        this.classroomExitBorder.isStatic = true;
    }

    createHitboxes() {
        this.matter.add.rectangle(gameData.width/2, 77, gameData.width, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width/2, 883, gameData.width, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(0, gameData.height/2, 300, gameData.height, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width, gameData.height/2, 300, gameData.height, 0xff0000).isStatic = true;

        this.matter.add.rectangle(315, 668, 200, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(608, 668, 200, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(915, 668, 200, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(1215, 668, 200, 100, 0xff0000).isStatic = true;

        this.matter.add.rectangle(315, 465, 200, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(610, 465, 200, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(915, 465, 200, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(1210, 465, 200, 100, 0xff0000).isStatic = true;

        this.matter.add.rectangle(410, 240, 400, 100, 0xff0000).isStatic = true;
        
        this.matter.add.rectangle(gameData.width-310, 160, 90, 80, 0xff0000).isStatic = true;
    }

    createCollisionEvents() {
        this.classroomExit.onCollideCallback = (pair) => {
            if (pair.bodyB.gameObject.id == playerData.id) {
                this.enterText = this.add.image(gameData.width-150, gameData.height/2-100, 'ExitText');
                this.enterText.scale = 0.3;
                this.input.keyboard.on('keydown_E', () => this.exitClassroom(), this);
            }
        };

        this.classroomExit.onCollideEndCallback = (pair) => {
            if (this.enterText && pair.bodyB.gameObject.id == playerData.id) {
                this.enterText.destroy();
            }
            this.input.keyboard.removeAllListeners('keydown_E');
        }

        this.quizEnterance = this.matter.add.rectangle(gameData.width/2+5, 420, 50, 50, 0x000000, 1);
        this.quizEnterance.isStatic = true;
        this.quizEnteranceBorder = this.matter.add.rectangle(gameData.width/2+5, 420, 70, 70, 0x000000, 1);
        this.quizEnteranceBorder.isStatic = true;

        this.quizEnterance.onCollideCallback = (pair) => {
            this.enterText = this.add.image(gameData.width/2 + 100, 140, 'ANG');
            this.enterText.scale = 0.5;
            this.input.keyboard.on('keydown_E', () => this.enterQuiz(), this);
        }

        this.quizEnterance.onCollideEndCallback = () => {
            if (this.enterText) {
                this.enterText.destroy();
            }
            this.input.keyboard.removeAllListeners('keydown_E');
        }

        this.dndEnterance = this.matter.add.rectangle(370, 665, 50, 50, 0x000000, 1);
        this.dndEnterance.isStatic = true;
        this.dndEnteranceBorder = this.matter.add.rectangle(370, 665, 70, 70, 0x000000, 1);
        this.dndEnteranceBorder.isStatic = true;

        this.dndEnterance.onCollideCallback = () => {
            this.enterText = this.add.image(gameData.width/2 + 100, 140, 'MAT');
            this.enterText.scale = 0.5;
            this.input.keyboard.on('keydown_E', () => this.enterdnd(), this);
        }

        this.dndEnterance.onCollideEndCallback = () => {
            this.enterText.destroy();
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
    }

    exitClassroom() {
        changeRoom(3, 2, this);
    }

    enterQuiz() {
        // var chat = document.getElementById("chat");
        // chat.style.display = "none";
        // var game = document.getElementById("game");
        // game.style.display = "none";
        var quiz = document.getElementById("quiz");
        quiz.style.display = "block";
    }

    enterdnd() {
        // var chat = document.getElementById("chat");
        // chat.style.display = "none";
        // var game = document.getElementById("game");
        // game.style.display = "none";
        var dnd = document.getElementById("dragndrop");
        dnd.style.display = "block"; 
    }

}

