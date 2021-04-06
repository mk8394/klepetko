let shortID = require('shortid');

module.exports = class ChatData {
    constructor(msg) {
        this.id = shortID.generate();
        this.msg = msg;
    }
}