import { saveChatSettings } from "../services/chatSettingsService.js";

function setupchatSettingsEvents() {
    const chatFormSettings = document.getElementById("chat-form__settings");
    if (chatFormSettings) {
        chatFormSettings.addEventListener("submit", (event) => {
            event.preventDefault();
            saveChatSettings(chatFormSettings);
        });
    } else {
        console.log(`Chat form settings is ${chatFormSettings}`);
    }    
};

export { setupchatSettingsEvents };