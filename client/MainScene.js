import Player from './Player.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        Player.preload(this);
        this.load.image('outside', 'assets/outside.png');
    }
    
    create() {
        this.add.image(400, 451/2, 'outside');
        this.player = new Player({scene: this, x: 0, y: 0, texture: 'player', frame: '3'});
        this.player.inputKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        this.player.update();
    }
}