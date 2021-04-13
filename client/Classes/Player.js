let Vector2 = require('./Vector2.js');
let shortid = require('shortid');

module.exports = class Player {
    constructor(username) {
        this.id = shortid.generate();
        this.username = username;
        this.position = new Vector2();
    }

    // draw() {
    //     ctx.fillText(this.username, Math.random() * 100, Math.random() * 100);
    // }
}