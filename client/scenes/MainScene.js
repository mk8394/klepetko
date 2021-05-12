// Schoolyard scene (Main Scene)

import Player from '../classes/Player.js';
export const socket = io('http://localhost:3000');

import { setSocketEvents, removeSocketEvents } from '../helpers/socketEvents.js'
import { users, message, spawnPlayer, spawnOtherUser, playerData, changeRoom, gameData, createHUD, preloadHUD, setBounds } from '../helpers/clientData.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');   
    }

    init(data) {
        // Get data from login
        if(data.username) {
            this.playerSpawn = {
                x: gameData.width/2,
                y: 700
            }
            this.playerName = data.username;
        } else if(data.player) {
            this.playerSpawn = {
                x: gameData.width/2,
                y: 350
            }
            this.playerName = data.player.usernameText;
            data.player.server.changeRoom(playerData.id, 1);
        }
    }

    preload() {
        Player.preload(this);
        this.load.image('Outside', 'assets/Rooms/Outside.png');
        preloadHUD(this);
        setSocketEvents(this);
    }

    create() {
        setBounds(this);
        this.createBackground();
        spawnPlayer(this);
        createHUD(this);
    }

    createBackground() {
        this.add.image(gameData.width/2, gameData.height/2, 'Outside');

        this.schoolEntrance = this.matter.add.rectangle(gameData.width/2, 300, 100, 50, 0xff0000, 1);
        this.schoolEntrance.isStatic = true;
        this.schoolEntranceBorder = this.matter.add.rectangle(gameData.width/2, 300, 120, 70, 0xff0000, 1);
        this.schoolEntranceBorder.isStatic = true;
    }

    createHitboxes() {
        this.matter.add.rectangle(gameData.width/2, 200, 560, 300, 0xff0000).isStatic = true;
    }

    createCollisionEvents() {
        this.schoolEntrance.onCollideCallback = (pair) => {
            if(pair.bodyB.gameObject.id == playerData.id) {
                this.enterText = this.add.image(gameData.width/2, 227, 'EnterText');
                this.enterText.scale = 0.3;
                this.input.keyboard.on('keydown_E', () => this.enterSchool(), this);
            }
        };

        this.schoolEntrance.onCollideEndCallback = () => {
            if(this.enterText) {
                this.enterText.destroy();
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
    };

    enterSchool() {
        changeRoom(1, 2, this);
    }

}

