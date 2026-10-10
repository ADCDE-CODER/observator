<script setup>
    import ChatList from '../components/ChatList.vue';
    import ChatMessages from '../components/ChatMessage.vue';
    import ChatSettings from '../components/ChatSettings.vue';
    import ProgressOverlay from '../components/ProgressOverlay.vue';
    import { onMounted, ref } from 'vue';
    import { authState } from '../state/authState';
    import { applyProvider, applyProviderConfig, applyModel, applyConfig, getChatMetadata, restartChatMetadata } from '../services/chatMetadataService.js';
    import { addMessages, getMessages } from '../services/messageService';
    import { addChat, getChats, modifyChat, removeChat } from '../services/chatService';
    import { MarkdownUtil } from '../utils/MarkdownUtil.js';

    const selectedChatId = ref(null);
    const chats = ref([]);
    const messages = ref([]);
    const settings = ref({});
    const progress = ref({});
    const showProgress = ref(false);

    onMounted(async () => {
        if (authState.user != null) {
            await receiveAllChats(authState.user.token);
        }

        if (authState.user != null && authState.selectedChatId != null) {
            selectedChatId.value = authState.selectedChatId;
            await receiveAllMessages(selectedChatId.value, authState.user.token);
            await getSettings(selectedChatId.value, authState.user.token);
        }
    });

    async function createChat(title, userToken) {
        try {
            const result = await addChat(title, userToken);
            alert(result.message);
            chats.value.unshift(result.chat.lastChatItem) 
        } catch (error) {
            alert(error.message);
        }
    }

    async function receiveAllChats(userToken) {
        try {
            const result = await getChats(userToken);
            chats.value = result.chats.reverse();
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
                clearSelection();
            } catch (error) {
                alert(error.message);
            }
        }
    }

    function selectChat(id) {
        selectedChatId.value = id;
        authState.setSelectedChatId(id);
        receiveAllMessages(id, authState.user.token);
        getSettings(id, authState.user.token);
    }

    function clearSelection() {
        selectedChatId.value = null;
        authState.setSelectedChatId(null);
    }

    async function createMessage(userChatMessage, username, chatId, userToken) {
        const userMessage = { ...userChatMessage };
        userMessage.sender = username;
        userMessage.content = MarkdownUtil.renderMarkdown(userMessage.content);
        messages.value.push(userMessage);
        
        let thinkingBuffer = "";
        let contentBuffer = "";
        let lastMessageIndex = null;

        try {
            await addMessages(userChatMessage, chatId, userToken, (assistantChatMessage) => {
                const currentMessage = assistantChatMessage;
                
                if (!lastMessageIndex) {
                    if(currentMessage.thinking) {
                        thinkingBuffer = currentMessage.thinking;
                        currentMessage.thinking = MarkdownUtil.renderMarkdown(thinkingBuffer);
                    } else if (currentMessage.content) {
                        contentBuffer = currentMessage.content;
                        currentMessage.thinking = MarkdownUtil.renderMarkdown(contentBuffer);
                    }
                    
                    currentMessage.sender = currentMessage.model;
    
                    messages.value.push(currentMessage);
                    lastMessageIndex = messages.value.length - 1;
                } else {
                    const targetMessage = messages.value[lastMessageIndex];
    
                    if (currentMessage.thinking) {
                        thinkingBuffer += currentMessage.thinking;
                        targetMessage.thinking = MarkdownUtil.renderMarkdown(thinkingBuffer);
                    } else if (currentMessage.content) {
                        contentBuffer += currentMessage.content;
                        targetMessage.content = MarkdownUtil.renderMarkdown(contentBuffer);
                    }
    
                    if(currentMessage.done) {
                        targetMessage.createdAt = currentMessage.createdAt;
                    }
                }
            });
        } catch (error) {
            alert(error.message);
        }
    }

    async function receiveAllMessages(id, userToken) {
        try {
            const result = await getMessages(id, userToken);
            
            result.chatMessages.forEach(message => {
                if (message.role === "assistant") {
                    message.thinking = MarkdownUtil.renderMarkdown(message.thinking);
                    message.sender = message.model;
                } else if (message.role === "user") {
                    message.sender = authState.user.username;
                }

                message.content = MarkdownUtil.renderMarkdown(message.content);
            });

            messages.value = result.chatMessages;
        } catch (error) {
            alert(error.message);
        }
    }

    async function getSettings(chatId, userToken) {
        try {
            const result = await getChatMetadata(chatId, userToken);
            console.log(result)
            settings.value = result.metadata
        } catch (error) {
            alert(error.message);
        }
    }

    async function applySettings(settingsObject, chatId, userToken) {
        try {
            if (settingsObject.section === "provider") {
                const result = await applyProvider(settingsObject, chatId, userToken);
                settings.value = result.metadata
            }

            if (settingsObject.section === "providerConfig") {
                const result = await applyProviderConfig(settingsObject, chatId, userToken);
                settings.value.providerConfig = result.metadata.providerConfig
            }

            if (settingsObject.section === "model") {
                await applyModel(settingsObject, chatId, userToken, (eventType, data) => {
                    if (eventType === "progress") {
                        progress.value = data;
                        showProgress.value = true;
                    }

                    if (eventType === "complete") {
                        settings.value.model = data.metadata.model;
                    }
                });
            }

            if (settingsObject.section === "config") {
                const result = await applyConfig(settingsObject, chatId, userToken);
                settings.value.config = result.metadata.config
            }
        } catch (error) {
            alert(error.message);
        }
    }

    async function resetSettings(endpoint, chatId, userToken) {
        try {
            const result = await restartChatMetadata(endpoint, chatId, userToken);
            
            if (result.metadata.section === "provider") {
                settings.value = result.metadata;
            }

            if (result.metadata.section === "providerConfig") {
                settings.value.providerConfig = result.metadata.providerConfig;
            }

            if (result.metadata.section === "model") {
                settings.value.model = result.metadata.model;
            }

            if (result.metadata.section === "config") {
                settings.value.config = result.metadata.config;
            }
        } catch (error) {
            alert(error.message);
        }
    }

    function closeProgress() {
        showProgress.value = false;
    }
</script>

<template>
    <section class="no-chat" v-show="!authState.user">
        <h2>No user</h2>
    </section>

    <section class="chat" v-show="authState.user"> 
       <ChatList 
       :selected-chat-id="selectedChatId" 
       :chats="chats" 
       @select-chat="(id) => selectChat(id)"
       @clear-selection="() => clearSelection()"
       @create-chat="() => createChat(null, authState.user.token)"
       @delete-chat="(id) => deleteChat(id, authState.user.token)"
       @rename-chat="(id, title) => renameChat(title, id, authState.user.token)"
       />

       <ChatMessages
       :selected-id="selectedChatId"
       :messages="messages"
       @create-message="(userChatMessage) => createMessage(userChatMessage, authState.user.username, authState.selectedChatId, authState.user.token)"
       />

       <ChatSettings
       :selected-id="selectedChatId"
       :settings="settings"
       @apply-settings="(settings) => applySettings(settings, authState.selectedChatId, authState.user.token)"
       @reset-settings="(endpoint) => resetSettings(endpoint, authState.selectedChatId, authState.user.token)"
       />

       <ProgressOverlay
       :show-progress="showProgress"
       :progress="progress"
       @close="() => closeProgress()"
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