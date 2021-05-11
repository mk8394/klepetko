// Hallway scene

import Player from '../classes/Player.js';
import { socket } from './MainScene.js';

import { setSocketEvents, removeSocketEvents } from '../helpers/socketEvents.js'
import { users, message, spawnPlayer, spawnOtherUser, playerData, changeRoom, gameData, setBounds, createHUD } from '../helpers/clientData.js';

export default class HallwayScene extends Phaser.Scene {
    constructor() {
        super('HallwayScene');
    }

    init(data) {
        this.playerName = data.player.usernameText;
        data.player.server.changeRoom(playerData.id, 2);
        
        // console.log(this.playerData);
    }

    preload() {
        Player.preload(this);
        this.load.image('Hallway', 'assets/rooms/Hallway.png');
        setSocketEvents(this);
    }

    create() {
        setBounds(this);
        this.createBackground();
        spawnPlayer(this);
        createHUD(this);
    }

    createBackground() {
        this.add.image(gameData.width/2, gameData.height/2, 'Hallway');
        this.add.text(0,0,'Hallway');

        this.schoolExit = this.matter.add.rectangle(gameData.width/2, 900, 100, 50, 0xff0000, 1);
        this.schoolExit.isStatic = true;
        this.schoolExitBorder = this.matter.add.rectangle(gameData.width/2, 900, 120, 70, 0xff0000, 1);
        this.schoolExitBorder.isStatic = true;

        this.classroomEnter = this.matter.add.rectangle(150, gameData.height/2, 50, 100, 0xff0000, 1);
        this.classroomEnter.isStatic = true;
        this.classroomEnterBorder = this.matter.add.rectangle(150, gameData.height/2, 70, 120, 0xff0000, 1);
        this.classroomEnterBorder.isStatic = true;

        this.lockerEnter = this.matter.add.rectangle(gameData.width-150, gameData.height/2, 50, 100, 0xff0000, 1);
        this.lockerEnter.isStatic = true;
        this.lockerEnterBorder = this.matter.add.rectangle(gameData.width-150, gameData.height/2, 70, 120, 0xff0000, 1);
        this.lockerEnterBorder.isStatic = true;
    }

    createHitboxes() {
        // this.matter.add.rectangle(gameData.width/2, 200, 560, 300, 0xff0000).isStatic = true;
    }

    createCollisionEvents() {

        // Exit school
        this.schoolExit.onCollideCallback = (pair) => {
            console.log('pair:',pair)
            if(pair.bodyB.gameObject.id == playerData.id) {
                this.exitText = this.add.image(gameData.width/2, 950, 'ExitText');
                this.exitText.scale = 0.3;
                this.input.keyboard.on('keydown_E', () => this.leaveSchool(), this);
            }
        };

        this.schoolExit.onCollideEndCallback = () => {
            if(this.exitText) {
                this.exitText.destroy();
            }
            this.input.keyboard.removeAllListeners('keydown_E');
        }

        // Enter classroom
        this.classroomEnter.onCollideCallback = (pair) => {
            console.log('pair:',pair)
            if(pair.bodyB.gameObject.id == playerData.id) {
                this.exitText = this.add.text(100, 50, 'Pritisni E za vstop v učilnico');
                this.input.keyboard.on('keydown_E', () => this.enterClassroom(), this);
            }
        };

        this.classroomEnter.onCollideEndCallback = () => {
            if(this.exitText) {
                this.exitText.destroy();
            }
            this.input.keyboard.removeAllListeners('keydown_E');
        }

        // Enter locker
        this.lockerEnter.onCollideCallback = (pair) => {
            console.log('pair:',pair)
            if(pair.bodyB.gameObject.id == playerData.id) {
                this.exitText = this.add.text(100, 50, 'Pritisni E za vstop v garderobo');
                this.input.keyboard.on('keydown_E', () => this.enterLocker(), this);
            }
        };

        this.lockerEnter.onCollideEndCallback = () => {
            if(this.exitText) {
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
        console.log('--spawning--', user);
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

