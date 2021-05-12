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
        let colliderY = this.y + 50;
        let playerCollider = Bodies.circle(this.x, colliderY, 24, {isSensor: false, label: 'playerCollider'});
        let playerSensor = Bodies.circle(this.x, colliderY, 58, {isSensor: true, label: 'playerSensor'});
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor]
        });
        this.setExistingBody(compoundBody);
        
        this.socket = socket;
        this.usernameText = username;

    }

    static preload(scene) {
        scene.load.atlas('character', '../assets/character/Atlases/character.png', '../assets/character/Atlases/character_atlas.json');
        scene.load.animation('character_anim', '../assets/character/Atlases/character_anim.json');
        scene.load.image('SpeechBubble', '../assets/HUD/SpeechBubble.png');
        scene.load.image('UsernameBG', '../assets/HUD/UsernameBG.png');
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
        const speed = 5;
        let playerVelocity = new Phaser.Math.Vector2();

        if (this.inputKeys.left.isDown && this.inputKeys.right.isUp) {
            playerVelocity.x = -1;
            if(this.inputKeys.up.isUp && this.inputKeys.down.isUp) {
                this.anims.play('walk_left', true);
            }
        } else if (this.inputKeys.right.isDown && this.inputKeys.left.isUp) {
            playerVelocity.x = 1;
            if(this.inputKeys.up.isUp && this.inputKeys.down.isUp) {
                this.anims.play('walk_right', true);
            }
        }

        if (this.inputKeys.up.isDown && this.inputKeys.down.isUp) {
            playerVelocity.y = -1;
            this.anims.play('walk_back', true);
        } else if (this.inputKeys.down.isDown && this.inputKeys.up.isUp) {
            playerVelocity.y = 1;
            this.anims.play('walk_front', true);
        }

        if(this.inputKeys.down.isUp &&
            this.inputKeys.up.isUp &&
            this.inputKeys.right.isUp &&
            this.inputKeys.left.isUp) {
                this.anims.play('idle_front', false);
        }

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);

        // Send data to server
        this.server.playerPosition(this.id, playerVelocity, this.x, this.y);

    }

    updateUser(user, userVelocity, x, y) {

        // user.setVelocity(userVelocity.x, userVelocity.y);
        if(user) {
            user.x = x;
            user.y = y;

            if (userVelocity.y < 0) {
                user.anims.play('walk_back', true);
            } else if (userVelocity.y > 0) {
                user.anims.play('walk_front', true);
            } else if (userVelocity.x < 0) {
                user.anims.play('walk_left', true);
            } else if (userVelocity.x > 0) {
                user.anims.play('walk_right', true);
            } else {
                user.anims.play('idle_front', false);
            }
    
        }

        if(user.username) {
            // user.usernameBG.y = y - 80;
            // user.usernameBG.x = x;
            user.username.y = y + 85;
            user.username.x = x;
        }
        if (user.bubble && user.bubbleContent) {
            user.bubble.x = user.x;
            user.bubble.y = user.y - 70;
            user.bubbleContent.x = user.x + 15;
            user.bubbleContent.y = user.y - 114;
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
        // this.usernameBG = this.scene.add.image(this.x, this.y - 80, 'UsernameBG');
        // this.usernameBG.scale = 0.3;

        this.username = this.scene.add.text(this.x, this.y + 85, username, {
            fontFamily: 'Klepetko',
            fontSize: '20pt',
            strokeThickness: 2,
            stroke: 'black'
        }).setOrigin(0.5, 0.5);

    }

    // Update username position
    updateUsername() {
        this.username.setColor('aquamarine');
        // this.usernameBG.y = this.y + 85;
        // this.usernameBG.x = this.x;
        this.username.y = this.y + 85;
        this.username.x = this.x;
    }

    // Začasna funkcija za oblačke texta
    createSpeechBubble(x, y, width, height, quote) {
        if (this.bubble) {
            this.bubble.destroy();
            this.bubbleContent.destroy();
        }

        this.bubble = this.scene.add.image(x, y, 'SpeechBubble').setOrigin(0, 0.8);
        this.bubble.scale = 0.1;

        // var bubbleWidth = width;
        // var bubbleHeight = height;
        // var bubblePadding = 10;
        // var arrowHeight = bubbleHeight / 4;

        // this.bubble = this.scene.add.graphics({ x: x, y: y });

        //  Bubble shadow
        // this.bubble.fillStyle(0x222222, 0.5);
        // this.bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);

        //  Bubble color
        // this.bubble.fillStyle(0xffffff, 1);

        //  Bubble outline line style
        // this.bubble.lineStyle(4, 0x565656, 1);

        // //  Bubble shape and outline
        // this.bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
        // this.bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

        //  Calculate arrow coordinates
        // var point1X = Math.floor(bubbleWidth / 7);
        // var point1Y = bubbleHeight;
        // var point2X = Math.floor((bubbleWidth / 7) * 2);
        // var point2Y = bubbleHeight;
        // var point3X = Math.floor(bubbleWidth / 7);
        // var point3Y = Math.floor(bubbleHeight + arrowHeight);

        //  Bubble arrow shadow
        // this.bubble.lineStyle(4, 0x222222, 0.5);
        // this.bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

        //  Bubble arrow fill
        // this.bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
        // this.bubble.lineStyle(2, 0x565656, 1);
        // this.bubble.lineBetween(point2X, point2Y, point3X, point3Y);
        // this.bubble.lineBetween(point1X, point1Y, point3X, point3Y);

        this.bubbleContent = this.scene.add.text(0, 0, quote, { fontFamily: 'Klepetko', fontSize: 25, color: '#000000', align: 'center', maxLines: 1, fixedWidth: 135, wordWrap: {wordWrapWidth: 135, useAdvancedWrap: true } });

        // var b = this.bubbleContent.getBounds();
        // if (b.width > 135) {
            
        //     this.bubble.scale *= 1.5;
        // }
        // console.log(this.bubble.width, b.width);
        // console.log(b);

        this.bubbleContent.setPosition(this.bubble.x, this.bubble.y);
    }

    // Update speech bubble position
    updateSpeechBubble() {
        if (this.bubble && this.bubbleContent) {
            this.bubble.x = this.x;
            this.bubble.y = this.y - 70;
            this.bubbleContent.x = this.x + 15;
            this.bubbleContent.y = this.y - 114;
        }
    }

}