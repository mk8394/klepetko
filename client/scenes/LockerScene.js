// Locker scene

import Player from '../classes/Player.js';
import { socket } from './MainScene.js';

import { setSocketEvents, removeSocketEvents } from '../helpers/socketEvents.js'
import { users, message, spawnPlayer, spawnOtherUser, playerData, changeRoom, gameData, setBounds, createHUD } from '../helpers/clientData.js';

export default class LockerScene extends Phaser.Scene {
    constructor() {
        super('LockerScene');
    }

    init(data) {
        this.playerName = data.player.usernameText;
        data.player.server.changeRoom(playerData.id, 4);
        this.playerSpawn = {
            x: 300,
            y: gameData.height/2 - 100
        }
        this.skinNUM = data.player.skinNUM;
    }

    preload() {
        Player.preload(this);
        this.load.image('Locker', 'assets/Rooms/Locker.png');
        setSocketEvents(this);
    }

    create() {
        createHUD(this);
        setBounds(this);
        this.createBackground();
        spawnPlayer(this);
    }

    createBackground() {
        
        this.add.image(gameData.width / 2, 490, 'Locker');
        this.add.text(0, 0, 'Locker');

        this.lockerExit = this.matter.add.rectangle(80, gameData.height/2-60, 50, 100, 0xff0000, 1);
        this.lockerExit.isStatic = true;
        this.lockerExitBorder = this.matter.add.rectangle(80, gameData.height/2-60, 70, 120, 0xff0000, 1);
        this.lockerExitBorder.isStatic = true;
    }

    createHitboxes() {
        this.matter.add.rectangle(gameData.width/2, 77, gameData.width, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width/2, 883, gameData.width, 100, 0xff0000).isStatic = true;
        this.matter.add.rectangle(0, gameData.height/2, 300, gameData.height, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width, gameData.height/2, 300, gameData.height, 0xff0000).isStatic = true;

        this.matter.add.rectangle(365, 70, 400, 200, 0xff0000).isStatic = true;
        this.matter.add.rectangle(1210, 50, 1100, 300, 0xff0000).isStatic = true;
    }

    createCollisionEvents() {
        // Exit locker
        this.lockerExit.onCollideCallback = (pair) => {
            if (pair.bodyB.gameObject.id == playerData.id) {
                this.exitText = this.add.image(170, gameData.height / 2 - 200, 'ExitText');
                // this.exitText.scale = 0.3;
                this.input.keyboard.on('keydown_E', () => this.exitLocker(), this);
            }
        };

        this.lockerExit.onCollideEndCallback = (pair) => {
            if (this.exitText && pair.bodyB.gameObject.id == playerData.id) {
                this.exitText.destroy();
            }
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

    exitLocker() {
        changeRoom(4, 2, this);
    }

}

