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

export let animsNames = [
    ['walk_front_01', 'walk_back_01', 'walk_right_01', 'walk_left_01', 'idle_front_01'],
    ['walk_front_02', 'walk_back_02', 'walk_right_02', 'walk_left_02', 'idle_front_02'],
    ['walk_front_03', 'walk_back_03', 'walk_right_03', 'walk_left_03', 'idle_front_03'],
    ['walk_front_04', 'walk_back_04', 'walk_right_04', 'walk_left_04', 'idle_front_04'],
    ['walk_front_05', 'walk_back_05', 'walk_right_05', 'walk_left_05', 'idle_front_05'],
    ['walk_front_06', 'walk_back_06', 'walk_right_06', 'walk_left_06', 'idle_front_06'],
    ['walk_front_07', 'walk_back_07', 'walk_right_07', 'walk_left_07', 'idle_front_07'],
    ['walk_front_08', 'walk_back_08', 'walk_right_08', 'walk_left_08', 'idle_front_08'],
]

export let playerData = { id: null, skin: 'boy_01', frame: 'boy_m1-c2_front_', framesPath: '../assets/character/Atlases/boy_01.png', atlasPath: '../assets/character/Atlases/boy_01_atlas.json', animsPath: '../assets/character/Atlases/boy_01_anim.json', animsNames: animsNames[0], scene: scenes[0], coins: 0 };

export let skinsMale = ['boy_01', 'boy_02', 'boy_03', 'boy_04', 'girl_01', 'girl_02', 'girl_03', 'girl_04'];
export let framesMale = ['boy_m1-c2_front_', 'boy_m1-c3_front_', 'boy_m1-c4_front_', 'boy_m1-c1_front_', 'girl_m1-c1_front_', 'girl_m1-c2_front_', 'girl_m1-c3_front_', 'girl_m1-c4_front_'];
export let framesMalePaths = [
    '../assets/character/Atlases/boy_01.png',
    '../assets/character/Atlases/boy_02.png',
    '../assets/character/Atlases/boy_03.png',
    '../assets/character/Atlases/boy_04.png',
    '../assets/character/Atlases/girl_01.png',
    '../assets/character/Atlases/girl_02.png',
    '../assets/character/Atlases/girl_03.png',
    '../assets/character/Atlases/girl_04.png'
]
export let atlasMalePaths = [
    '../assets/character/Atlases/boy_01_atlas.json',
    '../assets/character/Atlases/boy_02_atlas.json',
    '../assets/character/Atlases/boy_03_atlas.json',
    '../assets/character/Atlases/boy_04_atlas.json',
    '../assets/character/Atlases/girl_01_atlas.json',
    '../assets/character/Atlases/girl_02_atlas.json',
    '../assets/character/Atlases/girl_03_atlas.json',
    '../assets/character/Atlases/girl_04_atlas.json'
]
export let animsMalePaths = [
    '../assets/character/Atlases/boy_01_anim.json',
    '../assets/character/Atlases/boy_02_anim.json',
    '../assets/character/Atlases/boy_03_anim.json',
    '../assets/character/Atlases/boy_04_anim.json',
    '../assets/character/Atlases/girl_01_anim.json',
    '../assets/character/Atlases/girl_02_anim.json',
    '../assets/character/Atlases/girl_03_anim.json',
    '../assets/character/Atlases/girl_04_anim.json'
]

export let skinsFemale = [];
export let framesFemale = [];
export let framesFemalePaths = [

]
export let atlasFemalePaths = [

]
export let animsFemalePaths = [

]

let isHelpOpen = false;
let isMapOpen = false;

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
        texture: playerData.skin,
        frame: playerData.frame,
    }, socket, playerData.id, scene.playerName, scene.skinNUM);

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
    if (!registered) {
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
        frame: user.frame
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
    for (let i in users) {
        if (users[i] != users[playerData.id]) {
            users[i].destroy();
            delete users[i];
        }
    }
    removeSocketEvents();
    delete scene.message.scene;
    // scene.message.chatForm.removeEventListener("submit", null);
    delete scene.message;
    playerData.scene = scenes[num];
    scene.scene.start(scenes[num], { player: scene.player, prevRoom: leave });
}

export const preloadHUD = (scene) => {
    scene.load.image('HUD', '../assets/HUD/Background.png');
    scene.load.image('Coins', '../assets/HUD/Coins.png');
    scene.load.image('Map', '../assets/HUD/Map.png');
    scene.load.image('Chat', '../assets/HUD/Chat.png');
    scene.load.image('EmojiChat', '../assets/HUD/EmojiChat.png');
    scene.load.image('Help', '../assets/HUD/Help.png');
    scene.load.image('HelpClose', '../assets/HUD/HelpClose.png');
    scene.load.image('HelpPopup', '../assets/HUD/HelpPopup.png');
    scene.load.image('InputChat', '../assets/HUD/InputChat.png');
    scene.load.image('EnterText', '../assets/HUD/Enter.png');
    scene.load.image('ExitText', '../assets/HUD/Exit.png');
    scene.load.image('Play', '../assets/HUD/Play.png');
    scene.load.image('SLO', '../assets/HUD/SLO.png');
    scene.load.image('ANG', '../assets/HUD/ANG.png');
    scene.load.image('MAT', '../assets/HUD/MAT.png');
    scene.load.image('MapMain', '../assets/HUD/Map/Outside.png');
    scene.load.image('MapHallway', '../assets/HUD/Map/Hallway.png');
    scene.load.image('MapClassroom', '../assets/HUD/Map/Classroom.png');
    scene.load.image('MapLocker', '../assets/HUD/Map/Locker.png');
}

export const createHUD = (scene) => {
    scene.add.rectangle(gameData.width / 2, gameData.height / 2, 1920, 1080, 0xffffff);
    scene.add.image(gameData.width / 2, gameData.height - 60, 'HUD');
    const map = scene.add.image(1758, 1030, 'Map');
    scene.add.image(204, 1030, 'Coins');
    scene.add.text(195, 1014, playerData.coins, { fontFamily: 'Klepetko', fontSize: 30, color: '#DED7E9' });
    const chatbox = document.getElementById("chat-main");
    const chat = scene.add.image(70, 1030, 'Chat');
    map.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            showMap(scene);
        });
    chat.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            if (chatbox.style.display == 'none') {
                chatbox.style.display = 'block';
            } else {
                chatbox.style.display = 'none';
            }
        });
    const help = scene.add.image(1850, 1030, 'Help');
    help.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            showHelp(scene);
        });
    scene.add.image(960, 1030, 'InputChat');
    const emojiPanel = document.getElementById("emoji_wrapper");
    const emojiBtn = scene.add.sprite(1512, 1030, 'EmojiChat');
    emojiBtn.setInteractive({ cursor: 'pointer' })
        .on('pointerdown', () => {
            if (emojiPanel.style.display == 'none') {
                emojiPanel.style.display = 'block';
            } else {
                emojiPanel.style.display = 'none';
            }
        });
    // scene.add.image(80, 1030, 'Profile').scale = 0.28;
    showHelp(scene);
    showHelp(scene);
}

export const setBounds = (scene) => {
    scene.matter.add.rectangle(gameData.width / 2, 0, 1920, 20, 0xff0000, 1).isStatic = true;
    scene.matter.add.rectangle(gameData.width / 2, gameData.height, 1920, 200, 0xff0000, 1).isStatic = true;
    // scene.matter.add.rectangle(0, gameData.height / 2, 50, 1080, 0xff0000, 1).isStatic = true;
    // scene.matter.add.rectangle(gameData.width, gameData.height / 2, 50, 1080, 0xff0000, 1).isStatic = true;
}

export const showHelp = (scene) => {
    if (!isHelpOpen) {
        scene.helpPopup = scene.add.image(gameData.width / 2, gameData.height / 2 - 60, 'HelpPopup');
        scene.helpPopup.scale = 1.2;
        isHelpOpen = true;
        scene.helpClose = scene.add.image(1400, 300 - 60, 'HelpClose');
        scene.helpClose.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                scene.helpPopup.destroy();
                scene.helpClose.destroy();
                scene.helpText.destroy();
                scene.boldText.destroy();
                isHelpOpen = false;
            });
        scene.helpText = scene.add.text(gameData.width / 2 - 50, gameData.height / 2 - 120 - 60, helpText, { fontFamily: 'Klepetko1', fontSize: 20, color: '#ED4599' });
        scene.boldText = scene.add.text(gameData.width / 2 - 50, gameData.height / 2 - 155 - 60, boldText, { fontFamily: 'Klepetko', fontSize: 20, color: '#ED4599' });
    } else {
        scene.helpPopup.destroy();
        scene.helpClose.destroy();
        scene.helpText.destroy();
        scene.boldText.destroy();
        isHelpOpen = false;
    }
}
const boldText = "Živijo in dobrodošel v Klepetku!\n\n\n\n\n\n\n\n\n\n\n\nŽelim ti veliko lepih trenutkov!\nTvoj Klepetko"
const helpText = "Tukaj se lahko pogovarjaš s\nsvojimi prijatelji, spoznaš nove\nsovrstnike ter se naučiš veliko novega.\n\nSvojega karakterja lahko premikaš s\ntipkami A, W, S in D.\nZa vstopanje v nove prostore in kvize,\nuporabi tipko E.\nZa pošiljanje sporočila pritisni tipko ENTER.";

export const showMap = (scene) => {
    let mapName = ""
    switch(playerData.scene) {
        case "MainScene": {
            mapName = 'MapMain';
            break;
        }
        case "HallwayScene": {
            mapName = 'MapHallway';
            break;
        }
        case "ClassroomScene": {
            mapName = 'MapClassroom';
            break;
        }
        case "LockerScene": {
            mapName = 'MapLocker';
            break;
        }
    }
    if (!isMapOpen) {
        scene.mapPopup = scene.add.image(gameData.width / 2, gameData.height / 2, mapName);
        isMapOpen = true;
    } else {
        scene.mapPopup.destroy();
        isMapOpen = false;
    }
}

export const loadingAnim = (scene) => {
    var progressBG = scene.add.graphics();
        var progressBar = scene.add.graphics();
        var progressBox = scene.add.graphics();
        progressBG.fillStyle(0xEF4288, 1);
        progressBox.fillStyle(0x222222, 0.2);
        progressBG.fillRect(0, 0, gameData.width, gameData.height);
        progressBox.fillRoundedRect(gameData.width/2-160, gameData.height/2-25, 320, 50, 25);
        scene.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRoundedRect(gameData.width/2-150, gameData.height/2-15, 300 * value, 30, 15);
        });

        scene.load.on('fileprogress', function (file) {
            
        });

        scene.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
        });
}