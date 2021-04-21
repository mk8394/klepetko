import MainScene from './MainScene.js'

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 451,
    //parent: 'name-of-the-div',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { y: 0 }
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
    scene: [MainScene]
};

var game = new Phaser.Game(config);