// Hallway scene

import Player from '../classes/Player.js';
import { socket } from './MainScene.js';

import { setSocketEvents, removeSocketEvents } from '../helpers/socketEvents.js'
import { users, message, spawnPlayer, spawnOtherUser, playerData, changeRoom, gameData, setBounds, createHUD, loadingAnim } from '../helpers/clientData.js';

export default class HallwayScene extends Phaser.Scene {
    constructor() {
        super('HallwayScene');
    }

    init(data) {
        this.playerName = data.player.usernameText;
        data.player.server.changeRoom(playerData.id, 2);
        if(data.prevRoom == 3) {
            this.playerSpawn = {
                x: 300,
                y: gameData.height/2 - 100
            }
        } else if (data.prevRoom == 4) {
            this.playerSpawn = {
                x: 1620,
                y: gameData.height/2 - 100
            }
        } else {
            this.playerSpawn = {
                x: gameData.width/2,
                y: 650
            }
        }
        this.skinNUM = data.player.skinNUM;
    }

    preload() {
        loadingAnim(this);
        Player.preload(this);
        this.load.image('Hallway', 'assets/rooms/Hallway.png');
        setSocketEvents(this);
    }

    create() {
        createHUD(this);
        setBounds(this);
        this.createBackground();
        spawnPlayer(this);
    }

    createBackground() {
        
        this.add.image(gameData.width/2, 490, 'Hallway');
        // this.add.text(0,0,'Hallway');

        this.schoolExit = this.matter.add.rectangle(gameData.width/2, 880, 120, 70, 0xff0000, 1);
        this.schoolExit.isStatic = true;
        this.schoolExitBorder = this.matter.add.rectangle(gameData.width/2, 880, 120, 70, 0xff0000, 1);
        this.schoolExitBorder.isStatic = true;

        this.classroomEnter = this.matter.add.rectangle(80, gameData.height/2-60, 50, 100, 0xff0000, 1);
        this.classroomEnter.isStatic = true;
        this.classroomEnterBorder = this.matter.add.rectangle(80, gameData.height/2-60, 70, 120, 0xff0000, 1);
        this.classroomEnterBorder.isStatic = true;

        this.lockerEnter = this.matter.add.rectangle(gameData.width-80, gameData.height/2-60, 50, 100, 0xff0000, 1);
        this.lockerEnter.isStatic = true;
        this.lockerEnterBorder = this.matter.add.rectangle(gameData.width-80, gameData.height/2-60, 70, 120, 0xff0000, 1);
        this.lockerEnterBorder.isStatic = true;
    }

    createHitboxes() {
        this.matter.add.rectangle(gameData.width/2, 77, gameData.width, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width/2, 883, gameData.width, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(0, gameData.height/2, 300, gameData.height, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width, gameData.height/2, 300, gameData.height, 0xff0000).isStatic = true;

        this.matter.add.rectangle(gameData.width-210, 160, 100, 60, 0xff0000).isStatic = true;
        this.matter.add.rectangle(210, 160, 100, 60, 0xff0000).isStatic = true;

        this.matter.add.rectangle(557, 160, 40, 60, 0xff0000).isStatic = true;
        this.matter.add.rectangle(868, 160, 40, 60, 0xff0000).isStatic = true;
        this.matter.add.rectangle(1060, 160, 40, 60, 0xff0000).isStatic = true;
        this.matter.add.rectangle(1365, 160, 40, 60, 0xff0000).isStatic = true;
    }

    createCollisionEvents() {

        // Exit school
        this.schoolExit.onCollideCallback = (pair) => {
            if(pair.bodyB.gameObject.id == playerData.id) {
                this.exitText = this.add.image(gameData.width/2, 650, 'ExitText');
                // this.exitText.scale = 0.3;
                this.input.keyboard.on('keydown_E', () => this.leaveSchool(), this);
            }
        };

        this.schoolExit.onCollideEndCallback = (pair) => {
            if(this.exitText && pair.bodyB.gameObject.id == playerData.id) {
                this.exitText.destroy();
            }
            this.input.keyboard.removeAllListeners('keydown_E');
        }

        // Enter classroom
        this.classroomEnter.onCollideCallback = (pair) => {
            if(pair.bodyB.gameObject.id == playerData.id) {
                this.exitText = this.add.image(170, gameData.height/2-200, 'EnterText');
                // this.exitText.scale = 0.3;
                this.input.keyboard.on('keydown_E', () => this.enterClassroom(), this);
            }
        };

        this.classroomEnter.onCollideEndCallback = (pair) => {
            if(this.exitText && pair.bodyB.gameObject.id == playerData.id) {
                this.exitText.destroy();
            }
            this.input.keyboard.removeAllListeners('keydown_E');
        }

        // Enter locker
        this.lockerEnter.onCollideCallback = (pair) => {
            if(pair.bodyB.gameObject.id == playerData.id) {
                this.exitText = this.add.image(gameData.width-170, gameData.height/2-200, 'EnterText');
                // this.exitText.scale = 0.3;
                this.input.keyboard.on('keydown_E', () => this.enterLocker(), this);
            }
        };

        this.lockerEnter.onCollideEndCallback = (pair) => {
            if(this.exitText && pair.bodyB.gameObject.id == playerData.id) {
                this.exitText.destroy();
            }
            this.input.keyboard.removeAllListeners('keydown_E');
        }

    }

    update() {
        this.player.update();

        // Disable movement while typing (may get removed for efficency)
        if(this.message.input === document.activeElement) {
            this.input.keyboard.enabled = false;
        } else {
            this.input.keyboard.enabled = true;
        }
    }

    // Spawn other users
    spawnUser(user, user_id) {
        spawnOtherUser(user, user_id, this);
    }

    leaveSchool() {
        changeRoom(2, 1, this);
    }

    enterClassroom() {
        changeRoom(2, 3, this);
    }

    enterLocker() {
        changeRoom(2, 4, this);
    }

}

