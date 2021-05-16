import { gameData } from "../helpers/clientData.js";

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    preload() {
        // this.load.image('Logo', './assets/HUD/Logo.png');

        // this.load.image('HelpBtn', './assets/HUD/HelpBtn.png');
        // this.load.image('LoginBG', './assets/HUD/LoginBG.png');


        this.load.image('Background', './assets/Login/Background.png');
        this.load.image('Form', './assets/Login/Form.png');
        this.load.image('PlayBtn', './assets/Login/PlayBtn.png');
        this.load.image('Input', './assets/Login/Input.png');
        this.load.image('Moski', './assets/Login/Moski.png');
        this.load.image('Zenska', './assets/Login/Zenska.png');
        this.load.image('Help', './assets/Login/Help.png');
    }

    create() {

        // Add html to scene
        var login = document.getElementById("login_wrapper");
        login.style.display = "block";

        // // Add background
        // this.add.image(gameData.width / 2, gameData.height / 2, 'LoginBG');

        // // Add logo
        // this.add.image(gameData.width / 2, gameData.height / 8, 'Logo');

        // // Add input
        // this.add.image(gameData.width / 2, gameData.height / 2 - 50, 'Input');

        // // Add play button to screen
        // const playBtn = this.add.image(gameData.width / 2, gameData.height / 1.5 - 30, 'PlayBtn');


        this.add.rectangle(gameData.width / 2, gameData.height / 2, 1920, 1080, 0xe8e9ec);
        this.add.image(gameData.width / 2, gameData.height / 2, 'Background');
        this.add.image(gameData.width / 2, 540, 'Form');
        const playBtn = this.add.image(gameData.width / 2, 780, 'PlayBtn');
        this.add.image(gameData.width / 2, 531, 'Input');
        const M = this.add.sprite(902, 643, 'Moski');
        const F = this.add.sprite(1022, 643, 'Zenska');
        const help = this.add.image(1351, 895, 'Help');

        this.isMale = true;

        // Play button functionality
        playBtn.on('pointerover', () => {
            playBtn.scale *= 1.05;
        })
        .on('pointerout', () => {
            playBtn.scale /= 1.05;
        });
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


        // Moski, Zenska
        M.on('pointerover', () => {
            M.scale *= 1.05;
        })
        .on('pointerout', () => {
            M.scale /= 1.05;
        });

        F.on('pointerover', () => {
            F.scale *= 1.05;
        })
        .on('pointerout', () => {
            F.scale /= 1.05;
        });

        M
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.isMale = true;
                console.log('male', this.isMale);
                F.clearTint();
                M.setTint(0xF8A6FF, 0xF8A6FF, 0xF8A6FF, 0xF8A6FF);
            });

        F
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.isMale = false;
                console.log('female', this.isMale);
                M.clearTint();
                F.setTint(0xF8A6FF, 0xF8A6FF, 0xF8A6FF, 0xF8A6FF);
            });

    }

    startGame(username) {

        // Load the main scene
        this.scene.start('MainScene', { username: username, isMale: this.isMale });

    }
}