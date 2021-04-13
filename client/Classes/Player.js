let Vector2 = require('./Vector2.js');
let shortid = require('shortid');

module.exports = class Player {
    constructor(username, game_width, game_height) {
        this.id = shortid.generate();
        this.username = username;
        this.position = new Vector2(game_width / 2, game_height / 2);
        this.sprite;
        // this.sprite.src;
    }

    // draw() {
    //     ctx.fillText(this.username, Math.random() * 100, Math.random() * 100);
    // }
}