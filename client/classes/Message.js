import Player from './Player.js';
import { socket } from '../scenes/MainScene.js';
import { playerData, users } from '../helpers/clientData.js';

export default class Message {
    constructor(scene) {
        // this.chatForm = document.getElementById("chat-form");
        this.chatMessages = document.querySelector(".chat-messages");
        this.input = document.querySelector('#msg');

        if (scene) {
            this.scene = scene;
            this.addEventListener();
        }
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
            if (users[message.id]) {
                user.createSpeechBubble(user.x, user.y - 70, 180, 50, message.text);
                // Reset time to live
                user.scene.time.removeAllEvents();

                // Time to live for this.player.bubble
                user.scene.time.addEvent({
                    delay: 5000,
                    callback: () => {
                        user.bubbleContent.destroy();
                        user.bubble.destroy();
                    }
                });
            }
        }

    }

    scrollToTop() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    addEventListener() {
        // Message send
        if (this.scene) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (this.input.value == "") {
                        this.input.value.focus();
                    } else {
                        // Send message to server

                        if (this.scene) {
                            // Get message text
                            let msg = this.input.value;

                            if (this.scene.scene.key == playerData.scene) {
                                socket.emit("chatMessage", this.scene.player.id, msg);
                            }

                            // Clear input
                            this.input.value = "";
                            // e.target.elements.msg.focus();
                            this.input.blur();
                        }
                    }



                }
            });


        }
    }

}