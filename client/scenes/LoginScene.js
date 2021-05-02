export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    preload() {
        this.load.html('login', './html/login.html');
        this.load.spritesheet('button', 'assets/startButton.png',
            { frameWidth: 450, frameHeight: 200 });
    }

    create() {

        // Add html to scene
        this.login = this.add.dom(400, 451 / 4).createFromCache('login').setOrigin(0.55);

        // Add play button to screen
        const playButton = this.add.sprite(400, 451 / 2, 'button');

        // Play button functionality
        playButton
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                let username = this.login.getChildByName('login').value;
                var chat = document.getElementById("chat");
                chat.style.display = "block";
                this.startGame(username);

            });

    }

    startGame(username) {

        // Load the main scene
        this.scene.start('MainScene', { username: username });
        
    }
}