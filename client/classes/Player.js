import { animsNames, playerData } from '../helpers/clientData.js';
import Server from './Server.js';

export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data, socket, id, username, skinNUM) {

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
        let colliderY = this.y;
        let playerCollider = Bodies.circle(this.x, colliderY+83, 30, {isSensor: false, label: 'playerCollider'});
        let playerSensor = Bodies.circle(this.x, colliderY+50, 100, {isSensor: true, label: 'playerSensor'});
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor]
        });
        this.setExistingBody(compoundBody);
        
        this.socket = socket;
        this.usernameText = username;
        this.skinNUM = skinNUM;

    }

    static preload(scene) {
        scene.load.atlas('boy_01', '../assets/character/Atlases/boy_01.png', '../assets/character/Atlases/boy_01_atlas.json');
        scene.load.animation('boy_01_anim', '../assets/character/Atlases/boy_01_anim.json');
        scene.load.atlas('boy_02', '../assets/character/Atlases/boy_02.png', '../assets/character/Atlases/boy_02_atlas.json');
        scene.load.animation('boy_02_anim', '../assets/character/Atlases/boy_02_anim.json');
        scene.load.atlas('boy_03', '../assets/character/Atlases/boy_03.png', '../assets/character/Atlases/boy_03_atlas.json');
        scene.load.animation('boy_03_anim', '../assets/character/Atlases/boy_03_anim.json');
        scene.load.atlas('boy_04', '../assets/character/Atlases/boy_04.png', '../assets/character/Atlases/boy_04_atlas.json');
        scene.load.animation('boy_04_anim', '../assets/character/Atlases/boy_04_anim.json');
        scene.load.atlas('girl_01', '../assets/character/Atlases/girl_01.png', '../assets/character/Atlases/girl_01_atlas.json');
        scene.load.animation('girl_01_anim', '../assets/character/Atlases/girl_01_anim.json');
        scene.load.atlas('girl_02', '../assets/character/Atlases/girl_02.png', '../assets/character/Atlases/girl_02_atlas.json');
        scene.load.animation('girl_02_anim', '../assets/character/Atlases/girl_02_anim.json');
        scene.load.atlas('girl_03', '../assets/character/Atlases/girl_03.png', '../assets/character/Atlases/girl_03_atlas.json');
        scene.load.animation('girl_03_anim', '../assets/character/Atlases/girl_03_anim.json');
        scene.load.atlas('girl_04', '../assets/character/Atlases/girl_04.png', '../assets/character/Atlases/girl_04_atlas.json');
        scene.load.animation('girl_04_anim', '../assets/character/Atlases/girl_04_anim.json');
        scene.load.image('SpeechBubble', '../assets/HUD/SpeechBubble.png');
        // scene.load.image('UsernameBG', '../assets/HUD/UsernameBG.png');
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
                this.anims.play(playerData.animsNames[3], true);
            }
        } else if (this.inputKeys.right.isDown && this.inputKeys.left.isUp) {
            playerVelocity.x = 1;
            if(this.inputKeys.up.isUp && this.inputKeys.down.isUp) {
                this.anims.play(playerData.animsNames[2], true);
            }
        }

        if (this.inputKeys.up.isDown && this.inputKeys.down.isUp) {
            playerVelocity.y = -1;
            this.anims.play(playerData.animsNames[1], true);
        } else if (this.inputKeys.down.isDown && this.inputKeys.up.isUp) {
            playerVelocity.y = 1;
            this.anims.play(playerData.animsNames[0], true);
        }

        if(this.inputKeys.down.isUp &&
            this.inputKeys.up.isUp &&
            this.inputKeys.right.isUp &&
            this.inputKeys.left.isUp) {
                this.anims.play(playerData.animsNames[4], false);
        }

        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);

        // Send data to server
        this.server.playerPosition(this.id, playerVelocity, this.x, this.y, this.skinNUM);

    }

    updateUser(user, userVelocity, x, y, skinNUM) {

        // user.setVelocity(userVelocity.x, userVelocity.y);
        if(user) {
            user.x = x;
            user.y = y;

            if (userVelocity.y < 0) {
                user.anims.play(animsNames[skinNUM][1], true);
            } else if (userVelocity.y > 0) {
                user.anims.play(animsNames[skinNUM][0], true);
            } else if (userVelocity.x < 0) {
                user.anims.play(animsNames[skinNUM][3], true);
            } else if (userVelocity.x > 0) {
                user.anims.play(animsNames[skinNUM][2], true);
            } else {
                user.anims.play(animsNames[skinNUM][4], false);
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