import Server from './Server.js';

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data, socket, id, username) {

        // Create and display player
        let { scene, x, y, texture, frame } = data;
        let options = { label: username };
        super(scene.matter.world, x, y, texture, frame, options);
        this.scene.add.existing(this);

        // Attach the Server class
        this.server = new Server(socket);
        // Set player id
        this.id = id;
        // Display & set username
        this.displayUsername(username);

        // Custom collider and sensor
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        let playerCollider = Bodies.circle(this.x, this.y, 24, {isSensor: false, label: 'playerCollider'});
        let playerSensor = Bodies.circle(this.x, this.y, 38, {isSensor: true, label: 'playerSensor'});
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor]
        });
        this.setExistingBody(compoundBody);

    }

    static preload(scene) {
        scene.load.atlas('player', 'assets/character/player.png', 'assets/character/player_atlas.json');
        scene.load.animation('player_anim', 'assets/character/player_anim.json');
    }

    // Getter for velocity (used in movement)
    get velocity() {
        return this.body.velocity;
    }

    update() {

        // Update username position
        if(this.username) {
            this.updateUsername();
        }

        // Update speech bubble position
        if(this.bubble && this.bubbleContent) {
            this.updateSpeechBubble();
        }

        // Movement variables and fucntions
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

        // Movement animations (DODAJ V VSE 4 SMERI!)
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.anims.play('player_walk', true);
        } else {
            this.anims.play('player_idle', false);
        }

        // Send data to server
        this.server.playerPosition(this.id, playerVelocity, this.x, this.y);

    }

    updateUser(user, userVelocity, x, y) {
        // user.setVelocity(userVelocity.x, userVelocity.y);
        user.x = x;
        user.y = y;
        if(user.username) {
            user.username.y = y - 50;
            user.username.x = x;
        }
        if (user.bubble && user.bubbleContent) {
            user.bubble.x = user.x;
            user.bubble.y = user.y - 100;
            user.bubbleContent.x = user.x + 10;
            user.bubbleContent.y = user.y - 100;
        }
    }

    // Remove user from game
    remove() {
        if(this.bubble) {
            this.bubble.destroy();
            this.bubbleContent.destroy();
        }
        this.username.destroy();
        this.destroy();
    }

    // Display username above the player
    displayUsername(username) {
        this.username = this.scene.add.text(this.x, this.y - 50, username).setOrigin(0.5, 0.5);
    }

    // Update username position
    updateUsername() {
        this.username.y = this.y - 50;
        this.username.x = this.x;
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

    // Update speech bubble position
    updateSpeechBubble() {
        if (this.bubble && this.bubbleContent) {
            this.bubble.x = this.x;
            this.bubble.y = this.y - 100;
            this.bubbleContent.x = this.x + 10;
            this.bubbleContent.y = this.y - 100;
        }
    }

}