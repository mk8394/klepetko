async function freeInstanceSpace(room) {
    // console.log(room);
    switch (Number(room.id)) {
        case 1: {
            rooms.r1[room.instance]--;
            break;
        }
        case 2: {
            rooms.r2[room.instance]--;
            break;
        }
    }
}


const setInstance = (id, user_id) => {
    switch (id) {
        case 1: {
            for (let i = 0; i < rooms.r1.length; i++) {
                if (rooms.r1[i] < maxPlayersInRoom) {
                    users[user_id].room.instance = i;
                    rooms.r1[i]++;
                    break;
                }
            }
            break;
        }
        case 2: {
            for (let i = 0; i < rooms.r2.length; i++) {
                if (rooms.r2[i] < maxPlayersInRoom) {
                    users[user_id].room.instance = i;
                    rooms.r2[i]++;
                    break;
                }
            }
            break;
        }
    }
}

// On room change
socket.on('leaveRoom', (user_id, room) => {
    let roomString = `${room.id}-${room.instance}`;
    socket.to(roomString).emit('leaveRoom', user_id);
});



let room = null;
room = users[user_id].room;

let roomString = `${users[user_id].room.id}-${users[user_id].room.instance}`;
// console.log(roomString);

setInstance(Number(room.id), user_id);
let roomString = `${room.id}-${room.instance}`;
socket.join(roomString);
users[user_id].room = room;

room

// Free space in instance
if (users[ids[socket.id]]) {
    freeInstanceSpace(users[ids[socket.id]].room);
}

let rooms = {
    r1: [0, 0, 0, 0, 0],
    r2: [0, 0, 0, 0, 0]
};
let maxPlayersInRoom = 10;


// Room / Scene ID, to identify in which room the player is
// Room instance (a room is only allowed a certain number of players)
if (room) {
    this.room = {
        id: room.id,
        instance: room.instance
    }
}

// Set roomid and instance
let room = {
    id: '1',
    instance: null // Defined by server, depending if the room is full
}

this.add.text(600, 400, 'room ' + room.id)

if (user.room.instance == this.player.room.instance) { }

// On leave room
socket.on('leaveRoom', (user_id) => {
    this.users[user_id].username.destroy();
    this.users[user_id].destroy();
    delete this.users[user_id];
});

this.player.room.instance = instance;