import { sendRequestMessage } from "../services/messageService.js";

function setupMessageEvents() {
    const sendButton = document.getElementById("send-button");
    if (sendButton) {
        sendButton.addEventListener("click", async () => {
            sendRequestMessage();
        });
    } else {
        console.log(`Send button is ${sendButton}`);
    }
};

export { setupMessageEvents };