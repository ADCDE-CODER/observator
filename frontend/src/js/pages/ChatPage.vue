<script setup>
    import ChatList from '../components/ChatList.vue';
    import ChatMessages from '../components/ChatMessage.vue';
    import ChatSettings from '../components/chatSettings.vue';
    import { onMounted, ref } from 'vue';
    import { authState } from '../state/authState';
    import { addMessages, getMessages } from '../services/messageService';
    import { addChat, getChat, modifyChat, removeChat } from '../services/chatService';
    import { renderMarkdown } from '../utils/markdownUtils.js';

    const selectedChatId = ref(null);
    const chats = ref([]);
    const messages = ref([]);
    const settings = ref([
        {
            title: "Reasoning",
            inputs: [
                {
                    name: "effort",
                    label: "Reasoning Effort",
                    type: "select",
                    value: "medium",
                    options: ["low", "medium", "high"]
                },
                {
                    name: "maxTokens",
                    label: "Max Tokens",
                    type: "number",
                    value: 1000,
                    min: 1,
                    max: 8000
                },
                {
                    name: "exclude",
                    label: "Exclude",
                    type: "checkbox",
                    value: false
                },
            ]
        },
        {
            title: "Usage",
            inputs: [
                {
                    name: "include",
                    label: "Include",
                    type: "checkbox",
                    value: false
                }
            ]
        },
        {
            title: "Generally",
            inputs: [
                {
                    name: "stream",
                    label: "Stream",
                    type: "checkbox",
                    value: false
                },
                {
                    name: "maxTokens",
                    label: "Max Tokens",
                    type: "number",
                    value: 1000,
                    min: 1,
                    max: 8000
                },
                {
                    name: "temperature",
                    label: "Temperature",
                    type: "number",
                    value: 0
                },
                {
                    name: "seed",
                    label: "Seed",
                    type: "number",
                    value: 0
                },
                {
                    name: "topP",
                    label: "Top P",
                    type: "number",
                    value: 0
                },
                {
                    name: "topK",
                    label: "Top K",
                    type: "number",
                    value: 0
                },
                {
                    name: "frequency-penalty",
                    label: "Frequency penalty",
                    type: "number",
                    value: 0
                },
                {
                    name: "presence-penalty",
                    label: "Presence penalty",
                    type: "number",
                    value: 0
                },
                {
                    name: "repetition-penalty",
                    label: "Repetition penalty",
                    type: "number",
                    value: 0
                },
                {
                    name: "logit-bias",
                    label: "Logit bias",
                    type: "text",
                    value: 0
                }
            ]
        }
    ]);

    onMounted(async () => {
        if (authState.user != null) {
            await receiveAllChats(authState.user);
        }

        if (authState.user != null && authState.selectedChatId != null) {
            selectedChatId.value = authState.selectedChatId;
            await receiveAllMessages(authState.user, selectedChatId.value) 
        }
    });

    async function createChat(user) {
        const response = await addChat(user);
        chats.value.push(response) 
    }

    async function receiveAllChats(user) {
        const response = await getChat(user);
        chats.value = response;
    }

    async function renameChat(user, id, title) {
        const chat = chats.value.find((chat) => {
            return chat.id === id 
        });

        if (chat) {
            await modifyChat(user, id, title);
            chat.title = title;
        }
    }

    async function deleteChat(user, id) {
        const index = chats.value.findIndex((chat) => {
            return chat.id === id 
        });

        if (index !== -1) {
            await removeChat(user, id);
            chats.value.splice(index, 1)
        }
    }

    function selectChat(id) {
        selectedChatId.value = id;
        authState.setSelectedChatId(id);
    }

    function clearSelection() {
        selectedChatId.value = null;
        authState.setSelectedChatId(null);
    }

    async function createMessage(user, userInput, token, chatSettings, selectedChatId) {
        const userInputHtml = renderMarkdown(userInput);
        const userObj = {
            sender: "user",
            message: userInputHtml
        };

        messages.value.push(userObj);
        
        let chunkBuffer = ""
        let messageContainerIndex = null;

        await addMessages(user, userInput, token, chatSettings, selectedChatId, (chunk) => {
            if (!messageContainerIndex) {
                chunkBuffer = chunk;
                const html = renderMarkdown(chunkBuffer);
                const aiObj = {
                    sender: "ai",
                    message: html
                };
                
                messages.value.push(aiObj);
                messageContainerIndex = messages.value.length - 1;
            } else {
                chunkBuffer += chunk;
                const html = renderMarkdown(chunkBuffer);
                
                messages.value[messageContainerIndex].message = html;
            }
        });
    }

    async function receiveAllMessages(user, id) {
        const response = await getMessages(user, id);

        const processedResponse = response.map(item => {
            const message = item.message;
            const html = renderMarkdown(message);

            return {
                ...item,
                message: html
            }
        });

        messages.value = processedResponse;
    }

    function applySettings(result) {
        authState.setChatSettings(result);
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
       @select-chat="(id) => {selectChat(id), receiveAllMessages(authState.user, id)}"
       @clear-selection="() => clearSelection()"
       @create-chat="() => createChat(authState.user)"
       @delete-chat="(id) => deleteChat(authState.user, id)"
       @rename-chat="(id, title) => renameChat(authState.user, id, title)"
       />

       <ChatMessages
       :selected-id="selectedChatId"
       :messages="messages"
       @create-message="(userInput) => createMessage(authState.user, userInput, authState.token, authState.chatSettings, authState.selectedChatId)"
       />

       <ChatSettings
       :settings="settings"
       @apply-settings="(result) => applySettings(result)"
       />
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
</style>