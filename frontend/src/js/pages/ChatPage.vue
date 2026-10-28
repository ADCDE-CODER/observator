<script setup>
    import ChatList from '../components/ChatList.vue';
    import ChatMessages from '../components/ChatMessage.vue';
    import ChatSettings from '../components/ChatSettings.vue';
    import ProgressOverlay from '../components/ProgressOverlay.vue';
    import { onMounted, ref } from 'vue';
    import { authState } from '../state/authState';
    import { MarkdownUtil } from '../utils/MarkdownUtil.js';
    import ChatService from '../modules/chat/ChatService.js';
    import ChatMessageService from '../modules/chatMessage/ChatMessageService.js';
    import ChatMetadataService from '../modules/chatMetadata/ChatMetadataService.js';

    const selectedChatId = ref(null);
    const chats = ref([]);
    const messages = ref([]);
    const settings = ref({});
    const progress = ref({});
    const showProgress = ref(false);

    let chatService;
    let chatMessageService;
    let chatMetadataService;

    onMounted(async () => {
        if (authState.user != null) {
            const userToken = authState.user.token;
            chatService = new ChatService(userToken);
            chatMessageService = new ChatMessageService(userToken);
            chatMetadataService = new ChatMetadataService(userToken);
            await receiveAllChats(userToken);
        }

        if (authState.user != null && authState.selectedChatId != null) {
            selectedChatId.value = authState.selectedChatId;
            await receiveAllMessages(selectedChatId.value);
            await getSettings(selectedChatId.value);
        }
    });

    async function createChat(title) {
        try {
            const result = await chatService.createChat(title);
            alert(result.message);
            chats.value.unshift(result.chat.lastChatItem) 
        } catch (error) {
            alert(error.message);
        }
    }

    async function receiveAllChats() {
        try {
            const result = await chatService.getAllChats();
            chats.value = result.chats.reverse();
        } catch (error) {
            alert(error.message);
        }
    }

    async function renameChat(id, title) {
        const chat = chats.value.find((chat) => {
            return chat.id === id 
        });

        if (chat) {
            try {
                const result = await chatService.updateChat(id, title);
                alert(result.message);
                chat.title = title;
            } catch (error) {
                alert(error.message);
            }
        }
    }

    async function deleteChat(id) {
        const index = chats.value.findIndex((chat) => {
            return chat.id === id 
        });

        if (index !== -1) {
            try {
                const result = await chatService.removeChat(id);
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
        receiveAllMessages(id);
        getSettings(id);
    }

    function clearSelection() {
        selectedChatId.value = null;
        authState.setSelectedChatId(null);
    }

    async function createMessage(chatId, userChatMessage, username) {
        const userMessage = { ...userChatMessage };
        userMessage.sender = username;
        userMessage.content = MarkdownUtil.renderMarkdown(userMessage.content);
        messages.value.push(userMessage);
        
        let thinkingBuffer = "";
        let contentBuffer = "";
        let lastMessageIndex = null;

        try {
            await chatMessageService.sendMessage(chatId, userChatMessage, (assistantChatMessage) => {
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

    async function receiveAllMessages(id) {
        try {
            const result = await chatMessageService.getMessages(id);
            
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

    async function getSettings(chatId) {
        try {
            const result = await chatMetadataService.getMetadata(chatId);
            settings.value = result.metadata;
        } catch (error) {
            alert(error.message);
        }
    }

    async function applySettings(chatId, settingsObject) {
        try {
            if (settingsObject.section === "provider") {
                const result = await chatMetadataService.updateProvider(chatId, settingsObject);
                settings.value = result.metadata
            }

            if (settingsObject.section === "providerConfig") {
                const result = await chatMetadataService.updateProviderConfig(chatId, settingsObject);
                settings.value.providerConfig = result.metadata.providerConfig;
                settings.value.model = result.metadata.model;
                settings.value.config = result.metadata.config;
            }

            if (settingsObject.section === "model") {
                await chatMetadataService.updateModel(chatId, settingsObject, (eventType, data) => {
                    if (eventType === "progress") {
                        progress.value = data;
                        showProgress.value = true;
                    }

                    if (eventType === "complete") {
                        settings.value.model = data.metadata.model;
                        settings.value.config = data.metadata.config;
                    }
                });
            }

            if (settingsObject.section === "config") {
                const result = await chatMetadataService.updateConfig(chatId, settingsObject);
                settings.value.config = result.metadata.config;
            }
        } catch (error) {
            alert(error.message);
        }
    }

    async function resetSettings(chatId, endpoint) {
        try {
            const result = await chatMetadataService.reset(chatId, endpoint);
            
            if (result.metadata.section === "provider") {
                settings.value.provider = result.metadata.provider;
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
       @create-chat="() => createChat(null)"
       @delete-chat="(id) => deleteChat(id)"
       @rename-chat="(id, title) => renameChat(id, title)"
       />

       <ChatMessages
       :selected-id="selectedChatId"
       :messages="messages"
       @create-message="(userChatMessage) => createMessage(authState.selectedChatId, userChatMessage, authState.user.username)"
       />

       <ChatSettings
       :selected-id="selectedChatId"
       :settings="settings"
       @apply-settings="(settings) => applySettings(authState.selectedChatId, settings)"
       @reset-settings="(endpoint) => resetSettings(authState.selectedChatId, endpoint)"
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