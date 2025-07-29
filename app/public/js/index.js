import { saveToLocalStorage, loadFromLocalStorage } from "./utils/localStorage.js";
import { createMessage } from "./api/createMessage.js";
import { showPage } from "./components/showPage.js";
import { setupNavigationEvents } from "./events/navigationEvents.js";
import { setupAuthEvents } from "./events/authEvents.js";
import { setupChatEvents } from "./events/chatEvents.js";
import { loadChatMenu } from "./services/chatService.js";

document.addEventListener("DOMContentLoaded", () => {
    setupNavigationEvents();
    setupAuthEvents();
    setupChatEvents();
    
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

const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", async () => {
    const userInput = document.getElementById("prompt-input");
    const userInputValue = userInput.value;

    if(!userInputValue.trim()) {
        alert("Please enter a message.");
    } else {
        const mainOutput = document.getElementById("content-main__output");

        // Collect localStorage values
        const user = loadFromLocalStorage("user");
        const token = loadFromLocalStorage("token");
        const chatSettings = loadFromLocalStorage("chatSettings");
        const selectedChatId = loadFromLocalStorage("selectedChatId");
        
        // Display user's message
        const userParameter = document.createElement("p");
        userParameter.innerText = `${user.email}: ${userInputValue}`;
        mainOutput.appendChild(userParameter);
        
        const result = await createMessage(token, userInputValue, chatSettings, selectedChatId);
        
        const aiParameter = document.createElement("p");
        
        if (result.ok && result.success) {
            // Display AI's message
            aiParameter.innerText = result.aiMessage;
            
            // Clear user's input
            userInput.value = "";
        } else {
            aiParameter.innerText = `Chat prompt failed: ${result.error} (status: ${result.status})`;
        }   

        mainOutput.appendChild(aiParameter); 
    }  
});