// Schoolyard scene (Main Scene)
import Player from '../classes/Player.js';
import Message from '../classes/Message.js';

const message = new Message();

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('HallwayScene');
    }

    preload() {
        this.load.image('hallway', 'assets/hallway.png');
    }

    create() {

        // Display background image
        // this.add.image(400, 451 / 2, 'hallway');
        this.add.text(0,0,'hallway');

    }

}

