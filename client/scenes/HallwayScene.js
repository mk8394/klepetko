// Hallway scene

import Player from '../classes/Player.js';
import { socket } from './MainScene.js';

import { setSocketEvents, removeSocketEvents } from '../helpers/socketEvents.js'
import { users, message, spawnPlayer, spawnOtherUser, playerData, changeRoom } from '../helpers/clientData.js';

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
        this.load.image('hallway', 'assets/hallway.png');
        setSocketEvents(this);
    }

    create() {
        this.createBackground();
        spawnPlayer(this);
    }

    createBackground() {
        this.add.image(400, 451 / 2, 'hallway');
        this.add.text(0,0,'hallway');

        this.schoolExit = this.matter.add.rectangle(400, 420, 100, 50, 0xff0000, 1);
        this.schoolExit.isStatic = true;
        this.schoolExitBorder = this.matter.add.rectangle(400, 420, 120, 70, 0xff0000, 1);
        this.schoolExitBorder.isStatic = true;
    }

    createCollisionEvents() {
        let pair = {
            bodyA: this.schoolExit,
            bodyB: this.player.body
        }

        this.schoolExit.onCollideCallback = () => {
            this.enterText = this.add.text(400, 100, 'Pritisni E za izstop iz šole');
            this.input.keyboard.on('keydown_E', () => this.leaveSchool(), this);
        };

        this.schoolExit.onCollideEndCallback = () => {
            this.enterText.destroy();
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
        // console.log('before leave', users);
        // this.scene.start('MainScene', this.player);
        // for(let i in users) {
        //     if(users[i] != this.player) {
        //         users[i].destroy();
        //         delete users[i];
        //     }
        // }
        // console.log('ready to leave', users);
        // this.player.server.changeRoom(this.player.id, 1);

        // this.player.username.destroy();
        // this.player.destroy();
        // delete this.message;
        // removeSocketEvents();
        changeRoom(2, 1, this);
    }

}

