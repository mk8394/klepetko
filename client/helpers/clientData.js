import Message from '../classes/Message.js';
import Player from '../classes/Player.js';
import { socket } from '../scenes/MainScene.js';
import { removeSocketEvents } from './socketEvents.js';

export const gameData = {
    width: 1920,
    height: 1080
}

export const users = {};
let registered = false;
const scenes = [
    'MainScene',
    'HallwayScene',
    'ClassroomScene',
    'LockerScene'
];
export let playerData = {id: null, scene: scenes[0]};

export const message = (scene) => {
    let message = new Message(scene);
    return message;
}

export const spawnPlayer = (scene) => {
    // Create a player game object
    scene.player = new Player({
        scene: scene,
        x: scene.playerSpawn.x,
        y: scene.playerSpawn.y,
        texture: 'character',
        frame: 'character_front_',
    }, socket, playerData.id, scene.playerName);

    scene.player.inputKeys = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    }, false);

    // Prevent rotation
    scene.matter.body.setInertia(scene.player.body, Infinity);
    scene.player.setFriction(0);

    // Disable collision between players
    scene.player.body.collisionFilter.group = -1;

    // Set objet name (helps with username)
    scene.player.name = scene.playerName;

    // Register new player to the server
    if(!registered) {
        scene.player.server.register(scene.player);
        registered = true;
    }

    // Create collision events
    scene.createCollisionEvents();

    // Create hitboxes
    scene.createHitboxes();

    // Enable messages
    scene.message = message(scene);
}

export const spawnOtherUser = (user, user_id, scene) => {

    let newUser = new Player({
        scene: scene,
        x: user.x,
        y: user.y,
        texture: user.texture,
        frame: 'character_front_'
    }, socket, user_id, user.name);

    // Prevent rotation
    scene.matter.body.setInertia(newUser.body, Infinity);
    newUser.setFriction(0);

    // Disable collision between players
    newUser.body.collisionFilter.group = -1;

    // newUser.server.joinGame(newUser);
    users[user_id] = newUser;

}

export const changeRoom = (leave, enter, scene) => {
    
    let num = enter - 1;
    for(let i in users) {
        if(users[i] != users[playerData.id]) {
            users[i].destroy();
            delete users[i];
        }
    }
    removeSocketEvents();
    delete scene.message.scene;
    // scene.message.chatForm.removeEventListener("submit", null);
    delete scene.message;
    playerData.scene = scenes[num];
    scene.scene.start(scenes[num], {player: scene.player, prevRoom: leave});
}

export const preloadHUD = (scene) => {
    scene.load.image('HUD', '../assets/HUD/Background.png');
    scene.load.image('Coins', '../assets/HUD/Coins.png');
    scene.load.image('Profile', '../assets/HUD/Profile.png');
    scene.load.image('Map', '../assets/HUD/Map.png');
    scene.load.image('EnterText', '../assets/HUD/EnterText.png');
    scene.load.image('ExitText', '../assets/HUD/ExitText.png');
    scene.load.image('ANG', '../assets/HUD/ANG.png');
    scene.load.image('MAT', '../assets/HUD/MAT.png');
}

export const createHUD = (scene) => {
    scene.add.image(gameData.width/2, gameData.height/2, 'HUD');
    scene.add.image(1840, 1030, 'Map').scale = 0.28;
    scene.add.image(260, 1030, 'Coins').scale = 0.28;
    scene.add.image(80, 1030, 'Profile').scale = 0.28;
}

export const setBounds = (scene) => {
    scene.matter.add.rectangle(gameData.width/2, 0, 1920, 200, 0xff0000, 1).isStatic = true;
    scene.matter.add.rectangle(gameData.width/2, gameData.height, 1920, 200, 0xff0000, 1).isStatic = true;
    scene.matter.add.rectangle(0, gameData.height/2, 50, 1080, 0xff0000, 1).isStatic = true;
    scene.matter.add.rectangle(gameData.width, gameData.height/2, 50, 1080, 0xff0000, 1).isStatic = true;
}