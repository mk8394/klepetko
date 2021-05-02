import Server from './Server.js';

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data, socket, id, username) {
        let { scene, x, y, texture, frame } = data;
        let options = { label: username };
        super(scene.matter.world, x, y, texture, frame, options);
        this.scene.add.existing(this);
        this.server = new Server(socket);
        this.id = id;
        this.username = this.scene.add.text(x, y - 50, username).setOrigin(0.5, 0.5);
    }

    static preload(scene) {
        scene.load.atlas('player', 'assets/character/player.png', 'assets/character/player_atlas.json');
        scene.load.animation('player_anim', 'assets/character/player_anim.json');
    }

    get velocity() {
        return this.body.velocity;
    }

    update() {
        this.username.y = this.y - 50;
        this.username.x = this.x;

        if (this.bubble && this.bubbleContent) {
            this.bubble.x = this.x;
            this.bubble.y = this.y - 100;
            this.bubbleContent.x = this.x + 10;
            this.bubbleContent.y = this.y - 100;
        }

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
        this.server.playerPosition(this.id, playerVelocity, this.x, this.y);
    }

    remove() {
        this.destroy();
    }


    // Začasna funkcija za oblačke texta
    createSpeechBubble(x, y, width, height, quote) {
        if (this.bubble) {
            this.bubble.destroy();
            this.bubbleContent.destroy();
        }

        var bubbleWidth = width;
        var bubbleHeight = height;
        var bubblePadding = 10;
        var arrowHeight = bubbleHeight / 4;

        this.bubble = this.scene.add.graphics({ x: x, y: y });

        //  Bubble shadow
        this.bubble.fillStyle(0x222222, 0.5);
        this.bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

        //  Bubble color
        this.bubble.fillStyle(0xffffff, 1);

        //  Bubble outline line style
        this.bubble.lineStyle(4, 0x565656, 1);

        //  Bubble shape and outline
        this.bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        this.bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

        //  Calculate arrow coordinates
        var point1X = Math.floor(bubbleWidth / 7);
        var point1Y = bubbleHeight;
        var point2X = Math.floor((bubbleWidth / 7) * 2);
        var point2Y = bubbleHeight;
        var point3X = Math.floor(bubbleWidth / 7);
        var point3Y = Math.floor(bubbleHeight + arrowHeight);

        //  Bubble arrow shadow
        this.bubble.lineStyle(4, 0x222222, 0.5);
        this.bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

        //  Bubble arrow fill
        this.bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        this.bubble.lineStyle(2, 0x565656, 1);
        this.bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        this.bubble.lineBetween(point1X, point1Y, point3X, point3Y);

        this.bubbleContent = this.scene.add.text(0, 0, quote, { fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'center', wordWrap: { width: bubbleWidth - (bubblePadding * 2) } });

        var b = this.bubbleContent.getBounds();

        this.bubbleContent.setPosition(this.bubble.x + (bubbleWidth / 2) - (b.width / 2), this.bubble.y + (bubbleHeight / 2) - (b.height / 2));
    }


}