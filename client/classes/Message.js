import Player from './Player.js';

export default class Message {
    constructor() {
        this.chatForm = document.getElementById("chat-form");
        this.chatMessages = document.querySelector(".chat-messages");
        this.input = document.querySelector('#msg');
    }

    // Output message to DOM
    outputMessage(message, user) {

        // Create & append html
        const div = document.createElement("div");
        div.classList.add("message");
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
        ${message.text}
        </p>`;
        document.querySelector(".chat-messages").appendChild(div);


        if (user) {
            user.createSpeechBubble(user.x, user.y - 100, 100, 50, message.text);

            // Reset time to live
            user.scene.time.removeAllEvents();

            // Time to live for this.player.bubble
            user.scene.time.addEvent({
                delay: 3000,
                callback: () => {
                    user.bubbleContent.destroy();
                    user.bubble.destroy();
                }
            });
        }

    }

    scrollToTop() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

}