import LoginScene from './LoginScene.js';
import MainScene from './MainScene.js'

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 451,
    parent: 'game', // Name of the parent DIV
    dom: {
        createContainer: true
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { y: 0 },
            setBounds: true
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: 'matterCollison',
                mapping: 'matterCollision'
            }
        ]
    },
    scene: [LoginScene, MainScene]
};

var game = new Phaser.Game(config);