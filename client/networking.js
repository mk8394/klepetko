let ctx = document.getElementById('ctx').getContext('2d');
let username = document.getElementById('username');
let connectBtn = document.getElementById('connectBtn');

const registerEL = () => {
    if (!username.value) {
        connectBtn.disabled = true
    } else {
        connectBtn.disabled = false
    }
}
username.addEventListener('input', registerEL);

const connect = () => {
    let socket = io();

    if (username.value) {
        connectBtn.disabled = true;
        connectBtn.innerHTML = "Connected";
        username.removeEventListener('input', registerEL);

        socket.emit('register', username.value);
    }

    socket.on('spawn', (player) => {
        drawPlayer(player);
        console.log(player);
    });

    socket.on('updatePosition', (player) => {
        console.log("drawing?");
        drawPlayer(player);
    });
}

const drawPlayer = (player) => {
    ctx.clearRect(0, 0, 720, 480);
    ctx.fillText(player.username, player.position.x++, player.position.y++);
}