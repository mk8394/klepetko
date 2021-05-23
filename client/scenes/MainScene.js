// Schoolyard scene (Main Scene)

import Player from '../classes/Player.js';
const socketURL = `${window.location.hostname}`;
export const socket = io.connect(socketURL, { secure: true });

import { setSocketEvents, removeSocketEvents } from '../helpers/socketEvents.js'
import { users, message, spawnPlayer, spawnOtherUser, playerData, changeRoom, gameData, createHUD, preloadHUD, setBounds, skinsMale, framesMale, framesMalePaths, atlasMalePaths, animsMalePaths, animsNames, skinsFemale, framesFemale, framesFemalePaths, atlasFemalePaths, animsFemalePaths, loadingAnim } from '../helpers/clientData.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    init(data) {
        // Get data from login
        if (data.username) {
            this.playerSpawn = {
                x: gameData.width / 2,
                y: 700
            }
            this.playerName = data.username;
            playerData.chat = document.getElementById("chat");
            playerData.chatBool = true;
            if (data.isMale == true) {
                playerData.isMale = true;
                this.skinNUM = Math.floor(Math.random() * 3);
                playerData.skin = skinsMale[this.skinNUM];
                playerData.frame = framesMale[this.skinNUM];
                playerData.framesPath = framesMalePaths[this.skinNUM];
                playerData.atlasPath = atlasMalePaths[this.skinNUM];
                playerData.animsPath = animsMalePaths[this.skinNUM];
                playerData.animsNames = animsNames[this.skinNUM];
            } else {
                playerData.isMale = false;
                this.skinNUM = Math.floor(Math.random() * 3) + 4;
                playerData.skin = skinsMale[this.skinNUM];
                playerData.frame = framesMale[this.skinNUM];
                playerData.framesPath = framesMalePaths[this.skinNUM];
                playerData.atlasPath = atlasMalePaths[this.skinNUM];
                playerData.animsPath = animsMalePaths[this.skinNUM];
                playerData.animsNames = animsNames[this.skinNUM];
            }

        } else if (data.player) {

            this.playerSpawn = {
                x: gameData.width / 2,
                y: 350
            }
            this.playerName = data.player.usernameText;
            data.player.server.changeRoom(playerData.id, 1);

        }
    }

    preload() {
        loadingAnim(this);
        Player.preload(this);
        this.load.image('Outside', 'assets/Rooms/Outside.png');
        preloadHUD(this);
        setSocketEvents(this);
    }

    create() {
        createHUD(this);
        setBounds(this);
        this.createBackground();
        spawnPlayer(this);
        if(playerData.chatBool) {
            playerData.chat.style.display = "block";
            playerData.chatBool = false;
        }
    }

    createBackground() {

        this.add.image(gameData.width / 2 - 0.5, 490, 'Outside');

        this.schoolEntrance = this.matter.add.rectangle(gameData.width / 2, 200, 100, 50, 0xff0000, 1);
        this.schoolEntrance.isStatic = true;
        this.schoolEntranceBorder = this.matter.add.rectangle(gameData.width / 2, 200, 120, 70, 0xff0000, 1);
        this.schoolEntranceBorder.isStatic = true;
    }

    createHitboxes() {
        this.matter.add.rectangle(gameData.width / 2, 140, 550, 300, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 + 222, 358, 198, 10, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 + 222, 538, 198, 10, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 - 222, 358, 198, 10, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 - 232, 538, 198, 10, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 + 832, 358, 300, 10, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 + 832, 538, 300, 10, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 - 832, 358, 300, 10, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 - 832, 538, 300, 10, 0xff0000).isStatic = true;

        this.matter.add.rectangle(gameData.width / 2 + 545, 781, 270, 105, 0xff0000).isStatic = true;

        this.matter.add.rectangle(gameData.width / 2 + 235, 771, 120, 220, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 - 185, 775, 120, 220, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 + 780, 630, 120, 220, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 + 770, 195, 120, 220, 0xff0000).isStatic = true;
        this.matter.add.rectangle(gameData.width / 2 - 790, 660, 120, 220, 0xff0000).isStatic = true;
    }

    createCollisionEvents() {
        this.schoolEntrance.onCollideCallback = (pair) => {
            if (pair.bodyB.gameObject.id == playerData.id) {
                this.enterText = this.add.image(gameData.width / 2, gameData.height / 2 - 90, 'EnterText');
                // this.enterText.scale = 0.3;
                this.input.keyboard.on('keydown_E', () => this.enterSchool(), this);
            }
        };

        this.schoolEntrance.onCollideEndCallback = (pair) => {
            if (this.enterText && pair.bodyB.gameObject.id == playerData.id) {
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

