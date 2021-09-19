import LoginScene from './scenes/LoginScene.js';
import MainScene from './scenes/MainScene.js'
import HallwayScene from './scenes/HallwayScene.js'
import ClassroomScene from './scenes/ClassroomScene.js';
import LockerScene from './scenes/LockerScene.js';


var config = {
    type: Phaser.AUTO,
    physics: {
      default: 'matter',
      matter: {
        debug: false,
        gravity: { y: 0 },
        setBounds: true,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      parent: 'game',
      width: 1920,
      height: 1080,
    },
    dom: {
      createContainer: true
    },
    // plugins: {
    //     scene: [
    //         {
    //             plugin: PhaserMatterCollisionPlugin,
    //             key: 'matterCollision',
    //             mapping: 'matterCollision'
    //         }
    //     ]
    // },
    scene: [LoginScene, MainScene, HallwayScene, ClassroomScene, LockerScene]
};

var game = new Phaser.Game(config);
