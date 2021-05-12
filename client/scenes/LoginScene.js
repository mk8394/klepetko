import { gameData } from "../helpers/clientData.js";

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    preload() {
        this.load.image('Logo', './assets/HUD/Logo.png');
        this.load.image('PlayBtn', './assets/HUD/PlayBtn.png');
        this.load.image('HelpBtn', './assets/HUD/HelpBtn.png');
        this.load.image('LoginBG', './assets/HUD/LoginBG.png');
        this.load.image('Input', './assets/HUD/Input.png');
    }

    create() {

        // Add html to scene
        var login = document.getElementById("login_wrapper");
        login.style.display = "block";

        // Add background
        this.add.image(gameData.width / 2, gameData.height / 2, 'LoginBG');

        // Add logo
        this.add.image(gameData.width / 2, gameData.height / 8, 'Logo');

        // Add input
        this.add.image(gameData.width / 2, gameData.height / 2 - 50, 'Input');

        // Add play button to screen
        const playBtn = this.add.image(gameData.width / 2, gameData.height / 1.5 - 30, 'PlayBtn');

        // Play button functionality
        playBtn
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {

                let username = document.getElementById('username_input').value;

                if (username != "") {
                    var chat = document.getElementById("chat");
                    chat.style.display = "block";
                    login.style.display = "none";
                    this.startGame(username);
                }

            });

    }

    startGame(username) {

        // Load the main scene
        this.scene.start('MainScene', { username: username });

    }
}