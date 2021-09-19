const moment = require("moment");

function formatMessage(username, text, user_id) {
    return {
        username,
        text,
        time: moment().format("hh:mm"),
        id: user_id
    }
}

module.exports = formatMessage;