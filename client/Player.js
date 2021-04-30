import Server from './Server.js';

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data, socket, id, username) {
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);
        this.server = new Server(socket);
        this.id = id;
        this.username = username;
    }

    static preload(scene) {
        scene.load.atlas('player', 'assets/character/player.png', 'assets/character/player_atlas.json');
        scene.load.animation('player_anim', 'assets/character/player_anim.json');
    }

    get velocity() {
        return this.body.velocity;
    }

    update() {
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();

        if (this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
        }

        if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
        }

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);

        // Popravi/Dodaj animacijo v vse 4 smeri
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play('player_walk', true);
        } else {
            this.anims.play('player_idle', false);
        }

        // Send data to server
        this.server.playerPosition(this.id, playerVelocity);
    }

    remove() {
        this.destroy();
    }
}