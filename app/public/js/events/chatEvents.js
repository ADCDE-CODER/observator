import { createChatAndReloadMenu } from "../services/chatService.js";

function setupChatEvents() {
    const chatButton = document.getElementById("chat-button");
    if (chatButton) {
        chatButton.addEventListener("click", async () => {
            await createChatAndReloadMenu();
        });
    } else {
        console.log(`Chat button is ${chatButton}`);
    }
};

export { setupChatEvents };