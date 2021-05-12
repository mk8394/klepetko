import { socket } from '../scenes/MainScene.js';
import { playerData, users } from '../helpers/clientData.js';

// import { message } from '../helpers/clientData.js';

export const setSocketEvents = (scene) => {
    // Socket.io events on client

    // Register
    socket.on('registerPlayer', (id) => {
        playerData.id = id;
        scene.player.id = id;
        users[scene.player.id] = scene.player;
    });

    // Spawn other users
    socket.on('spawnUser', (user, user_id) => {
        scene.spawnUser(user, user_id);
    });

    // Disconnect a user
    socket.on('disconnected', (user_id) => {
        if (users[user_id]) {
            users[user_id].remove();
            delete users[user_id];
        }
    });

    // Update position of users
    socket.on('updatePosition', (id, userVelocity, x, y) => {
        if (users[id]) {
            users[id].updateUser(users[id], userVelocity, x, y);
        }
    });

    // Message recieve
    socket.on("message", msg => {
        scene.message.outputMessage(msg, users[msg.id]);
        scene.message.scrollToTop();
    });
    socket.on("message_player", msg => {
        scene.message.outputMessage(msg, scene.player);
        scene.message.scrollToTop();
    });

    // On user leaving room
    socket.on('leaveRoom', (id) => {
        if(users[id]) {
            users[id].username.destroy();
            users[id].destroy();
            delete users[id];
        }
    });

}

export const removeSocketEvents = () => {
    socket.removeAllListeners();
}