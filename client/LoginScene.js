export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    preload() {
        this.load.html('login', 'login.html');
        this.load.spritesheet('button', 'assets/startButton.png',
        { frameWidth: 450, frameHeight: 200});
    }

    create() {
        this.login = this.add.dom(400, 451/4).createFromCache('login').setOrigin(0.55);

        const playButton = this.add.sprite(400, 451/2, 'button');

        playButton
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                let username = this.login.getChildByName('login').value;
                this.startGame(username);
            });
    }

    startGame(username) {
        this.scene.start('MainScene', {username: username});
    }
}