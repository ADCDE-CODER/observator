import { setupNavigationEvents } from "./events/navigationEvents.js";
import { setupAuthEvents } from "./events/authEvents.js";
import { setupChatEvents } from "./events/chatEvents.js";
import { setupMessageEvents } from "./events/messageEvents.js";
import { setupchatSettingsEvents } from "./events/chatSettingsEvents.js";
import { showPage } from "./components/showPage.js";
import { loadChatMenu } from "./services/chatService.js";

document.addEventListener("DOMContentLoaded", () => {
    setupNavigationEvents();
    setupAuthEvents();
    setupChatEvents();
    setupMessageEvents();
    setupchatSettingsEvents();
    showPage('welcome', true);
    loadChatMenu();
});