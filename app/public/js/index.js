import { saveToLocalStorage } from "./utils/localStorage.js";
import { showPage } from "./components/showPage.js";
import { setupNavigationEvents } from "./events/navigationEvents.js";
import { setupAuthEvents } from "./events/authEvents.js";
import { setupChatEvents } from "./events/chatEvents.js";
import { loadChatMenu } from "./services/chatService.js";
import { setupMessageEvents } from "./events/messageEvents.js";

document.addEventListener("DOMContentLoaded", () => {
    setupNavigationEvents();
    setupAuthEvents();
    setupChatEvents();
    setupMessageEvents();
    
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

const chatFormSettings = document.getElementById("chat-form__settings");

chatFormSettings.addEventListener("submit", (event) => {
    event.preventDefault();

    const chatSettings = {};

    Array.from(chatFormSettings.elements).forEach( (element) => {
        if (!element) {
            return;
        } else {
            if (element.type === "checkbox") {
                chatSettings[element.name] = element.checked;
            } else {

                if ( element.type === "number") {
                    const parseNumber = parseFloat(element.value)

                    if (isNaN(parseNumber)) {
                        chatSettings[element.name] = null;
                    } else {
                        chatSettings[element.name] = parseNumber;
                    }
                } else {
                    const value = element.value;

                    if (value === "") {
                        chatSettings[element.name] = null;
                    } else {
                        chatSettings[element.name] = value;
                    }
                }
            }
        }
    });

    console.log("Data: ", chatSettings);
    saveToLocalStorage("chatSettings", chatSettings);
});