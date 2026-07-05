<script setup>
    import ChatList from '../components/ChatList.vue';
    import ChatMessages from '../components/ChatMessage.vue';
    import { onMounted, ref } from 'vue';
    import { authState } from '../state/authState';
    import { addMessages, getMessages } from '../services/messageService';
    import { saveChatSettings } from '../services/chatSettingsService';
    import { addChat, getChat, modifyChat, removeChat } from '../services/chatService';

    const chats = ref([]);
    const selectedChatId = ref(null);
    const messages = ref([]);

    onMounted(async () => {
        await receiveAllChats();
    });

    async function createChat() {
        const response = await addChat(authState.user);
        chats.value.push(response) 
    }

    async function receiveAllChats() {
        const response = await getChat(authState.user);
        chats.value = response;
    }

    async function renameChat(id, title) {
        const chat = chats.value.find((chat) => {
            return chat.id === id 
        });

        if (chat) {
            await modifyChat(authState.user, id, title);
            chat.title = title;
        }
    }

    async function deleteChat(id) {
        const index = chats.value.findIndex((chat) => {
            return chat.id === id 
        });

        if (index !== -1) {
            await removeChat(authState.user, id);
            chats.value.splice(index, 1)
        }
    }

    async function selectChat(id) {
        selectedChatId.value = id;
        await receiveAllMessages(id);
    }

    function clearSelection() {
        selectedChatId.value = null;
    }

    async function createMessage(userInputValue) {
        const response = await addMessages(authState.user, userInputValue, authState.token, authState.chatSettings, authState.selectedChatId);
        messages.value.push(response);
    }

    async function receiveAllMessages(id) {
        const response = await getMessages(authState.user, id);
        messages.value = response;
    }

    function sendChatSettings(event) {
        event.preventDefault();
        const form = document.getElementById("chat-form__settings");
        saveChatSettings(form);
    }
</script>

<template>
    <section class="no-chat" v-show="!authState.user">
        <h2>No user</h2>
    </section>

    <section class="chat" v-show="authState.user"> 
       <ChatList 
       :chats="chats" 
       :selected-chat-id="selectedChatId" 
       @select-chat="(id) => selectChat(id)"
       @clear-selection="() => clearSelection()"
       @create-chat="() => createChat()"
       @delete-chat="(id) => deleteChat(id)"
       @rename-chat="(id, title) => renameChat(id, title)"
       />

       <ChatMessages
       :selected-id="selectedChatId"
       :messages="messages"
       @create-message="(userInputValue) => createMessage(userInputValue)"
       />

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
    .no-chat {
        background-color: var(--color-surface);
        color: var(--color-on-surface);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
    
    .chat {
        display: flex;
        justify-content: space-between;
        height: 100%;
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