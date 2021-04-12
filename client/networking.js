let ctx = document.getElementById('ctx').getContext('2d');
let username = document.getElementById('username');
let connectBtn = document.getElementById('connectBtn');
let actualCtx = document.getElementById('ctx');

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

    document.getElementById('ctx').style.display = 'inline';
    document.getElementById('connectBtn').style.display = 'none';
    document.getElementById('username').style.display = 'none';

    if (username.value) {
        connectBtn.disabled = true;
        connectBtn.innerHTML = "Connected";
        username.removeEventListener('input', registerEL);

        socket.emit('register', username.value);
    }

    // size of canvas object
    var style = window.getComputedStyle(actualCtx);
    var width = style.getPropertyValue('width');
    var height = style.getPropertyValue('height');
    var actualWidth = width.substring(0, width.length - 2);
    var actualHeight = height.substring(0, height.length - 2);

    socket.on('spawn', (player) => {
        ctx.fillText(player.username, actualWidth/2, actualHeight/2);
        console.log(player);
    });
}