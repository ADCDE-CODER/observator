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
    
    const navLinks = document.querySelectorAll("#nav-header__menu a");

    for (let i = 0; i < navLinks.length; i++) {
        const navLink = navLinks[i];
        navLink.addEventListener("click", (event) => {
            event.preventDefault();

            const pageID = navLink.getAttribute("href").substring(1);
            showPage(pageID, true);
        })
    }
});