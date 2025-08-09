import { setupChatEvents } from "../events/chatEvents.js";
import { setupMessageEvents } from "../events/messageEvents.js";
import { setupchatSettingsEvents } from "../events/chatSettingsEvents.js";
import { setupNavigationEvents } from "../events/navigationEvents.js";
import { setupAuthEvents } from "../events/authEvents.js";
import { loadChatMenu } from "./chatService.js";
import { loadFromLocalStorage } from "../utils/localStorage.js";
import { showPage } from "../components/showPage.js";

function initUserSession() {
    const user = loadFromLocalStorage("user");
    if (user) {        
        setupChatEvents();
        setupMessageEvents();
        setupchatSettingsEvents();
        loadChatMenu();
        showPage("chat");
    } else {
        setupAuthEvents();
        showPage("welcome");
    }
    setupNavigationEvents();
};

export { initUserSession };