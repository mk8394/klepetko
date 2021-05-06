import Message from '../classes/Message.js';
import Player from '../classes/Player.js';
import { socket } from '../scenes/MainScene.js';
import { removeSocketEvents } from './socketEvents.js';

export let playerData = {id: null};
export const users = {};
let registered = false;
const scenes = [
    'MainScene',
    'HallwayScene'
];

export const message = (scene) => {
    let message = new Message(scene);
    return message;
}

export const spawnPlayer = (scene) => {
    // Create a player game object
    scene.player = new Player({
        scene: scene,
        x: 400,
        y: 300,
        texture: 'player',
        frame: '3',
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

    // Enable messages
    scene.message = message(scene);
}

export const spawnOtherUser = (user, user_id, scene) => {

    let newUser = new Player({
        scene: scene,
        x: user.x,
        y: user.y,
        texture: 'player',
        frame: '3'
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
    console.log('ready to leave', users);
    // scene.player.server.changeRoom(playerData.id, 2);
    removeSocketEvents();
    scene.scene.start(scenes[num], {player: scene.player});
    // scene.player.username.destroy();
    // scene.player.destroy();
    // delete scene.message;
}