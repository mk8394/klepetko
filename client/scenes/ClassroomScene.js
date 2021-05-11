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
        
        // console.log(this.playerData);
    }

    preload() {
        Player.preload(this);
        this.load.image('Classroom', 'assets/Rooms/Classroom.png');
        setSocketEvents(this);
    }

    create() {
        setBounds(this);
        this.createBackground();
        spawnPlayer(this);
        createHUD(this);
    }

    createBackground() {
        this.add.image(gameData.width/2, gameData.height/2, 'Classroom');
        this.add.text(0,0,'Classroom');

        this.classroomExit = this.matter.add.rectangle(400, 420, 100, 50, 0xff0000, 1);
        this.classroomExit.isStatic = true;
        this.classroomExitBorder = this.matter.add.rectangle(400, 420, 120, 70, 0xff0000, 1);
        this.classroomExitBorder.isStatic = true;
    }

    createHitboxes() {
        // this.matter.add.rectangle(gameData.width/2, 200, 560, 300, 0xff0000).isStatic = true;
    }

    createCollisionEvents() {
        this.classroomExit.onCollideCallback = (pair) => {
            if(pair.bodyB.gameObject.id == playerData.id) {
                this.enterText = this.add.text(400, 100, 'Pritisni E za izstop iz učilnice');
                this.input.keyboard.on('keydown_E', () => this.exitClassroom(), this);
            }
        };

        this.classroomExit.onCollideEndCallback = () => {
            if(this.enterText) {
                this.enterText.destroy();
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

    exitClassroom() {
        changeRoom(3, 2, this);
    }

}

