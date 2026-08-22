<script setup>
    import ChatList from '../components/ChatList.vue';
    import ChatMessages from '../components/ChatMessage.vue';
    import ChatSettings from '../components/chatSettings.vue';
    import { onMounted, ref } from 'vue';
    import { authState } from '../state/authState';
    import { applyChatMetadata, getChatMetadata } from '../services/chatMetadataService.js';
    import { addMessages, getMessages } from '../services/messageService';
    import { addChat, getChats, modifyChat, removeChat } from '../services/chatService';
    import { renderMarkdown } from '../utils/markdownUtils.js';

    const selectedChatId = ref(null);
    const chats = ref([]);
    const messages = ref([]);
    const settings = ref([
        {
            title: "Body",
            inputs: [
                {
                    name: "provider",
                    label: "Provider",
                    type: "select",
                    value: "ollama",
                    options: ["openai", "ollama"]
                },
                {
                    name: "model",
                    label: "Model",
                    type: "text",
                    value: ""
                },
                {
                    name: "system_content",
                    label: "System Content",
                    type: "text",
                    value: "",
                },
                {
                    name: "think",
                    label: "Think",
                    type: "select",
                    value: "medium",
                    options: ["low", "medium", "high", "max"]
                }
            ]
        },
        {
            title: "Options",
            inputs: [
                {
                    name: "temperature",
                    label: "Temperature",
                    type: "number",
                    value: 0,
                    min: 0,
                    max: 2,
                    step: 0.1
                },
                {
                    name: "top_k",
                    label: "Top K",
                    type: "number",
                    value: 1,
                    min: 0,
                    max: 100,
                    step: 1,
                },
                {
                    name: "top_p",
                    label: "Top P",
                    type: "number",
                    value: 0,
                    min: 0,
                    max: 1,
                    step: 0.1
                },
                {
                    name: "min_p",
                    label: "Min P",
                    type: "number",
                    value: 0,
                    min: 0,
                    max: 2,
                    step: 0.01
                },
                {
                    name: "context",
                    label: "Context",
                    type: "number",
                    value: 0,
                    min: 0,
                    step: 512
                },
                {
                    name: "predict",
                    label: "Predict",
                    type: "number",
                    value: 0,
                    min: 0,
                    step: 512
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

    async function createChat(title, userToken) {
        try {
            const result = await addChat(title, userToken);
            alert(result.message);
            chats.value.push(result.chat.lastChatItem) 
        } catch (error) {
            alert(error.message);
        }
    }

    async function receiveAllChats(userToken) {
        try {
            const result = await getChats(userToken);
            chats.value = result.chats;
        } catch (error) {
            alert(error.message);
        }
    }

    async function renameChat(title, id, userToken) {
        const chat = chats.value.find((chat) => {
            return chat.id === id 
        });

        if (chat) {
            try {
                const result = await modifyChat(title, id, userToken);
                alert(result.message);
                chat.title = title;
            } catch (error) {
                alert(error.message);
            }
        }
    }

    async function deleteChat(id, userToken) {
        const index = chats.value.findIndex((chat) => {
            return chat.id === id 
        });

        if (index !== -1) {
            try {
                const result = await removeChat(id, userToken);
                alert(result.message);
                chats.value.splice(index, 1);
            } catch (error) {
                alert(error.message);
            }
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

    function applySettings(settings) {
        authState.setChatSettings(settings);
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
       @apply-settings="(settings) => applySettings(settings)"
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
        width: 100%;
        margin: 0 auto;
        max-width: 3000px;
    }
</style>