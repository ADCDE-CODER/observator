import { saveToLocalStorage, loadFromLocalStorage, removeLocalStorage, clearLocalStorage } from "./utils/localStorage.js";
import { signupUser } from "./api/signup.js";
import { signinUser } from "./api/signin.js";
import { createChat } from "./api/createChat.js";
import { fetchChat } from "./api/fetchChat.js";
import { fetchMessage } from "./api/fetchMessage.js";
import { createMessage } from "./api/createMessage.js";
import { showPage } from "./components/showPage.js";
import { setupNavigationEvents } from "./events/navigationEvents.js";

document.addEventListener("DOMContentLoaded", () => {
    setupNavigationEvents();
    
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

const signUpButton = document.getElementById("signup-button");

signUpButton.addEventListener("click", async () => {
    const emailInput = document.getElementById("create-email");
    const passwordInput = document.getElementById("create-password");

    const email = emailInput.value;
    const password = passwordInput.value;

    const result = await signupUser(email, password);

    if (result.ok && result.success) {
        emailInput.value = "";
        passwordInput.value = "";

        alert(result.message);
    } else {
        alert(`${result.error} (status: ${result.status})`);
    }
});

const signInButton = document.getElementById("signin-button");

signInButton.addEventListener("click", async () => {
    const emailInput = document.getElementById("read-email");
    const passwordInput = document.getElementById("read-password");

    const email = emailInput.value;
    const password = passwordInput.value;

    const result = await signinUser(email, password);

    if (result.ok && result.success) {
        emailInput.value = "";
        passwordInput.value = "";

        saveToLocalStorage("token", result.token);
        saveToLocalStorage("user", result.user);

        showPage("chat", true);
        loadChatMenu();  
        alert(result.message);
    } else {
        alert(`${result.error} (status: ${result.status})`);
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

const chatButton = document.getElementById("chat-button");

chatButton.addEventListener("click", async () => {
    const user = loadFromLocalStorage("user");
    const result = await createChat(user);

    if (result.ok && result.success) {
        const chatMenuContent = document.getElementById("content-main__menuContent");
        
        const chatLink = document.createElement("a");
        chatLink.id = result.lastChatItem.id
        chatLink.classList.add("chatsMenu");
        chatLink.innerText = result.lastChatItem.title;
        
        chatLink.addEventListener("click", () => {
            showChat(result.lastChatItem.id);
        });

        chatMenuContent.appendChild(chatLink);

        alert(result.message);
    } else {
        alert(`${result.error} (status: ${result.status})`);
    }
});

async function loadChatMenu() {
    const user = loadFromLocalStorage("user");
    const chatMenuContent = document.getElementById("content-main__menuContent");
    
    if (user) {
        const result = await fetchChat(user);

        if (result.ok && result.success) {
                
            result.chats.forEach( (chat) => {                    
                const chatLink = document.createElement("a");
                chatLink.id = chat.id
                chatLink.classList.add("chatsMenu");
                chatLink.innerText = chat.title;

                chatLink.addEventListener("click", () => {
                    showChat(chat.id);
                });

                chatMenuContent.appendChild(chatLink);
            });

            console.log(result.message);
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }

    } else {
        chatMenuContent.innerHTML = "";
    }
};

async function showChat(selectedChatId) {
    saveToLocalStorage("selectedChatId", selectedChatId);
    const output = document.getElementById("content-main__output");
    output.innerHTML = "";

    const chatsMenu = document.getElementsByClassName("chatsMenu");

    for (let i = 0; i < chatsMenu.length; i++) {
       chatsMenu[i].classList.remove("active");
    }

    const selectedChat = document.getElementById(selectedChatId);
    selectedChat.classList.add("active");

    const result = await fetchMessage(selectedChatId);

    if (result.ok && result.success) {
        result.chatMessages.forEach( (chatMessage) => {                    
            const chatParameter = document.createElement("p");
            chatParameter.innerText = chatMessage.message;
            output.appendChild(chatParameter);
        });
        
        console.log(result.message);
    } else {
        alert(`${result.error} (status: ${result.status})`);
    }
};

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