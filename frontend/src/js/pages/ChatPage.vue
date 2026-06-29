<script setup>
    import { onMounted, ref } from 'vue';
    import { authState } from '../state/authState';
    import { addChat, getChat, modifyChat, removeChat } from '../services/chatService';
    import { addMessages, getMessages } from '../services/messageService';
    import { saveChatSettings } from '../services/chatSettingsService';

    const chats = ref([]);

    onMounted(async () => {
        const response = await getChat(authState.user);
        chats.value = response;
    });

    async function loadChat(user, chatId) {
        showActiveChatMenu(chatId, "chatsMenu");
        const messages = await getMessages(user, chatId);

        const mainOutput = document.getElementById("content-main__output");
        mainOutput.innerHTML = "";
        messages.forEach( (chatMessage) => {
            const chatParameter = document.createElement("p");
            chatParameter.textContent = `${chatMessage.message}`;
            mainOutput.appendChild(chatParameter);
        });
    }

    function showActiveChatMenu(selectedChatId, className) {
        authState.setSelectedChatId(selectedChatId);

        const chatsMenu = document.getElementsByClassName(className);
        if (chatsMenu) {
            for (let i = 0; i < chatsMenu.length; i++) {
                chatsMenu[i].classList.remove("active");
            }

            const selectedChat = document.getElementById(selectedChatId);
            if(selectedChat != null) {
                selectedChat.classList.add("active");
            }
        } else {
            console.log(`Chat menu is ${chatsMenu}`);
        }    
    };
    
    async function newChat(user) {
        await addChat(user);
        const response = await getChat(authState.user);
        chats.value = response;
    }

    function renameChat(user, chatId) {
        const title = prompt("Please enter to change chat title");
        if (title) {
            modifyChat(user, chatId, title);

            const chatLink = document.getElementById(chatId);
            chatLink.firstChild.textContent = title;
        }
    }

    async function deleteChat(user, chatId) {
        if (confirm("Do you want delete chat and messages forever?")) {
            removeChat(user, chatId);

            const chatLink = document.getElementById(chatId);
            chatLink.remove();

            const response = await getChat(authState.user);
            chats.value = response;
        }
    }

    // Listning for a dropdown button is pressed to show a dropdown 
    function showDropdown(event, chatId) {
        event.stopPropagation();

        const content = document.getElementById(chatId).childNodes[1].childNodes[1]
        if (content.style.display === "none") {
            content.style.display = "flex";
        } else {
            content.style.display = "none";
        }
    }

    // Listning for when cursor is pressed outside of dropdown element, then hide a dropdown
    document.addEventListener("click", (event) => {
        const chats = document.getElementsByClassName("chat-dropdown");

        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            
            const contentButton = chat.childNodes[0];
            const content = chat.childNodes[1];
            if (!content.contains(event.target) && !contentButton.contains(event.target)) {
                content.style.display = "none";
            }
        }
    });

    async function sendChat() {
        const userInput = document.getElementById("prompt-input");
        
        // Collect localStorage values
        const response = await addMessages(authState.user, userInput.value, authState.token, authState.chatSettings, authState.selectedChatId);

        // Display user's message
        const userParameter = document.createElement("p");
        userParameter.textContent = `${authState.user.email}: ${userInput.value}`;
        const aiParameter = document.createElement("p");

        if (!response.error) {
            // Display AI's message
            aiParameter.innerText = response;
            
            // Clear user's input
            userInput.value = "";
        } else {
            aiParameter.innerText = response;
        }
        const mainOutput = document.getElementById("content-main__output");
        mainOutput.append(userParameter, aiParameter);
    }

    function sendChatSettings(event) {
        event.preventDefault();
        const form = document.getElementById("chat-form__settings");
        saveChatSettings(form);
    }
</script>

<template>
    <section id="chat" class="content-main__page" v-show="!authState.user">
        <h2>No user</h2>
    </section>

    <section id="chat" class="content-main__page" v-show="authState.user">
        <div class="content-main__chats">
            <h2>Chats</h2>
            <button id="chat-button" @click="newChat(authState.user)">New chat</button>
            <aside id="content-main__menuContent">
                <a class="chatsMenu" v-bind:id="chat.id" v-for="chat in chats" :key="chat.id" @click="loadChat(authState.user, chat.id)">
                    {{ chat.title }}
                    <div class="chat-dropdown">
                        <button class="chat-dropdown__button" @click="showDropdown($event, chat.id)">...</button>
                        <div class="chat-dropdown__content" style="display: none;">
                            <a @click="renameChat(authState.user, chat.id)">Rename</a>
                            <a @click="deleteChat(authState.user, chat.id)">Delete</a>
                        </div>
                    </div>
                </a>
            </aside>
        </div>
        <div class="content-main__chat">
            <h2>Chat</h2>
            <div id="content-main__output"></div>
            <div class="content-main__button">
                <input id="prompt-input" type="text" placeholder="Type here">
                <button id="send-button" @click="sendChat()">Send</button>
            </div>
        </div>
        <div class="content-main__settings">
            <h2>Settings</h2>
            <form id="chat-form__settings">
                <div class="content-main__label">
                    <h3>Reasoning</h3>
                    <label for="effort">Effort:</label>
                    <input id="effort" name="effort" type="text" placeholder="Effort">

                    <label for="reasoning-max-tokens">Max tokens:</label>
                    <input id="reasoning-max-tokens" name="reasoning_max_tokens" type="number" placeholder="Max tokens">

                    <label for="exclude">Exclude:</label>
                    <input id="exclude" name="exclude" type="checkbox" placeholder="Exclude">
                </div>
                <div class="content-main__label">
                    <h3>Usage</h3>
                    <label for="include">Include:</label>
                    <input id="include" name="include" type="checkbox" placeholder="Include">
                </div>
                <h3>Generally</h3>
                <div class="content-main__label">
                    <label for="stream">Stream:</label>
                    <input id="stream" name="stream" type="checkbox" placeholder="Stream">
                </div>
                <div class="content-main__label">
                    <label for="max-tokens">Max tokens:</label>
                    <input id="max-tokens" name="max_tokens" type="number" placeholder="Max tokens">
                </div>
                <div class="content-main__label">
                    <label for="temperature">Temperature:</label>
                    <input id="temperature" name="temperature" type="number" placeholder="Temperature">
                </div>
                <div class="content-main__label">
                    <label for="seed">Seed:</label>
                    <input id="seed" name="seed" type="number" placeholder="Seed">
                </div>
                <div class="content-main__label">
                    <label for="top-p">Top-p:</label>
                    <input id="top-p" name="top_p" type="number" placeholder="Top-p">
                </div>
                <div class="content-main__label">
                    <label for="top-k">Top-k:</label>
                    <input id="top-k" name="top_k" type="number" placeholder="Top-k">
                </div>
                <div class="content-main__label">
                    <label for="frequency-penalty">Frequency penalty:</label>
                    <input id="frequency-penalty" name="frequency_penalty" type="number" placeholder="Frequency penalty">
                </div>
                <div class="content-main__label">
                    <label for="presence-penalty">Presence penalty:</label>
                    <input id="presence-penalty" name="presence_penalty" type="number" placeholder="Presence penalty">
                </div>
                <div class="content-main__label">
                    <label for="repetition-penalty">Repetition penalty:</label>
                    <input id="repetition-penalty" name="repetition_penalty" type="number" placeholder="Repetition penalty">
                </div>
                <div class="content-main__label">
                    <label for="logit-bias">Logit bias:</label>
                    <input id="logit-bias" name="logit_bias" type="text" placeholder="Logit bias">
                </div>
                <button type="submit" @click="sendChatSettings($event)">Apply</button>
            </form>
        </div>
    </section>
</template>

<style scoped>
    #chat {
        display: flex;
        justify-content: space-between;
        height: 100%;
    }

    .content-main__chats {
        background-color: bisque;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 100%;
        max-width: 20%;
    }

    #content-main__menuContent {
        background-color: coral;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    #content-main__menuContent > a{
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .chat-dropdown {
        position: relative;
    }

    .chat-dropdown__button {
        padding: 0.5rem;
        border-radius: 10px;
        border: none;
        background-color: white;
        color: #2b2b2b;
        transition: background-color 1s, color 1s, border 1s;
        cursor: pointer;
    }

    .chat-dropdown__content {
        position: absolute;
        flex-direction: column;
        background-color: #1b1b1b;
        top: 100%;
        right: 0%;
        padding: 4px;
        gap: 5px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .content-main__chat {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    #content-main__output {
        background-color: aliceblue;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 1rem;
    }

    .content-main__button {
        background-color: aquamarine;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        padding: 1%;
        gap: 1em;
    }

    .content-main__button > input {
        border: none;
        border-radius: 20px;
        padding: 10px;
        width: 50%;
    }

    .content-main__button > button {
        border: none;
        border-radius: 20px;
        padding: 10px;
    }

    .content-main__settings {
        background-color: azure;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 100%;
        max-width: 20%;
    }

    #chat-form__settings{
        background-color: chocolate;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;
        width: 100%;
        overflow-y: scroll;
    }

    .content-main__label{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
</style>