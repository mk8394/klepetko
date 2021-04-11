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
        ctx.fillText(player.username, Math.random() * 100, Math.random() * 100);
        console.log(player);
    });
}