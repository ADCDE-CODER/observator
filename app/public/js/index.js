import { saveToLocalStorage, loadFromLocalStorage, removeLocalStorage, clearLocalStorage } from "./utils/localStorage.js";
import { signupUser } from "./api/signup.js";
import { signinUser } from "./api/signin.js";
import { createChat } from "./api/createChat.js";
import { fetchChat } from "./api/fetchChat.js";

const navHeaderMenu = document.getElementById("nav-header__menu");
const navHeaderProfile = document.getElementById("nav-header__profile");

function showPage(id, storeHistory) {
    const pages = document.getElementsByClassName("content-main__page");
    
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        if (page.id == id) {
            page.style.display = "flex";   
        } else {
            page.style.display = "none";
        }
    }
    
    if (storeHistory) {
        history.pushState({ page: id }, "", "");
    }

    updateNavbarUI();
    loadChatMenu();  
};

function updateNavbarUI() {  

    const user = loadFromLocalStorage("user");

    if (!user) {
        navHeaderMenu.style.display = "none";
        navHeaderProfile.style.display = "none";
        loginMenuButton.style.display = "flex";
        logoutMenuButton.style.display = "none";
    } else {
        navHeaderMenu.style.display = "flex";
        navHeaderProfile.style.display = "flex";
        loginMenuButton.style.display = "none";
        logoutMenuButton.style.display = "flex";
    }
    
    console.log({...localStorage});
};

document.addEventListener("DOMContentLoaded", () => {
    showPage('welcome', true);

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

window.addEventListener("popstate", (event) => {
    showPage(event.state.page, false);
});

const logoButton = document.getElementById("nav-header__logo");

logoButton.addEventListener("click", () => {
    showPage("welcome", true);
});

const loginMenuButton = document.getElementById("loginMenu-button");

loginMenuButton.addEventListener("click", () => {
    showPage("sign-menu", true);
}); 

const logoutMenuButton = document.getElementById("logoutMenu-button");

logoutMenuButton.addEventListener("click", () => {
    clearLocalStorage();
    showPage("welcome", true);
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
        alert(`New chat failed: ${result.error} (status: ${result.status})`);
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
            alert(`Get chat failed: ${result.error} (status: ${result.status})`);
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

    try {
        const response = await fetch("http://localhost:3000/message/one", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                data: { 
                    chatId: selectedChatId 
                }
            })
        });

        const result = await response.json();

        if (response.ok) {

            if (result.success) {    
                result.chatMessages.forEach( (chatMessage) => {                    
                    const chatParameter = document.createElement("p");
                    chatParameter.innerText = chatMessage.message;
                    output.appendChild(chatParameter);
                });
                
                console.log(result.message);
            } else {
                alert(result.error);
            }

        } else {
            alert(`Failed to load chat messages: ${result.error} (status: ${response.status})`);
        }

    } catch (error) {
        const errorMessage = `Error loading chat messages: ${error.message}`;
        console.log(errorMessage);
        alert(errorMessage);
    }
};

const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", async () => {
    try {
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
            
            const response = await fetch("http://localhost:3000/message/prompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    data: { 
                        userInput: userInputValue, 
                        settings: chatSettings, 
                        chatId: selectedChatId 
                    }
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                
                // Display AI's message or error 
                const aiParameter = document.createElement("p");
                if (result.success) {
                    aiParameter.innerText = result.aiMessage;
                    userInput.value = "";
                } else {
                    aiParameter.innerText = result.error;
                }

                mainOutput.appendChild(aiParameter);  
            } else {
                alert(`Chat prompt failed: ${result.error} (status: ${response.status})`);
            }   
        }  
    } catch (error) {
        const errorMessage = `Chat prompt error: ${error.message}`;
        console.log(errorMessage);
        alert(errorMessage);
    }
});