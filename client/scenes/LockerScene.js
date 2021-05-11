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
        
        // console.log(this.playerData);
    }

    preload() {
        Player.preload(this);
        this.load.image('Locker', 'assets/Rooms/Locker.png');
        setSocketEvents(this);
    }

    create() {
        setBounds(this);
        this.createBackground();
        spawnPlayer(this);
        createHUD(this);
    }

    createBackground() {
        this.add.image(gameData.width/2, gameData.height/2, 'Locker');
        this.add.text(0,0,'Locker');

        this.lockerExit = this.matter.add.rectangle(150, gameData.height/2, 50, 100, 0xff0000, 1);
        this.lockerExit.isStatic = true;
        this.lockerExitBorder = this.matter.add.rectangle(150, gameData.height/2, 70, 120, 0xff0000, 1);
        this.lockerExitBorder.isStatic = true;
    }

    createHitboxes() {
        // this.matter.add.rectangle(gameData.width/2, 200, 560, 300, 0xff0000).isStatic = true;
    }

    createCollisionEvents() {
        // Exit locker
        this.lockerExit.onCollideCallback = (pair) => {
            console.log('pair:',pair)
            if(pair.bodyB.gameObject.id == playerData.id) {
                this.exitText = this.add.text(100, 50, 'Pritisni E za izstop iz garderobe');
                this.input.keyboard.on('keydown_E', () => this.exitLocker(), this);
            }
        };

        this.lockerExit.onCollideEndCallback = () => {
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

    exitLocker() {
        changeRoom(4, 2, this);
    }

}

