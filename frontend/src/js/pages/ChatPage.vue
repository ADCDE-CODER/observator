<script setup>
    import { ref, onMounted } from 'vue';
    import ChatList from '../components/ChatList.vue';
    import ChatMessages from '../components/ChatMessage.vue';
    import ChatSettings from '../components/ChatSettings.vue';
    import ProgressOverlay from '../components/ProgressOverlay.vue';
    import { authState } from '../state/authState';
    import { MarkdownUtil } from '../utils/MarkdownUtil.js';
    import ChatService from '../modules/chat/ChatService.js';
    import ChatMessageService from '../modules/chatMessage/ChatMessageService.js';
    import ChatMetadataService from '../modules/chatMetadata/ChatMetadataService.js';

    // Services
    const token = authState.user.token;
    const chatService = new ChatService(token);
    const chatMessageService = new ChatMessageService(token);
    const chatMetadataService = new ChatMetadataService(token);

    // Reactive state
    const selectedChatId = ref(null);
    const chats = ref([]);
    const messages = ref([]);
    const settings = ref({});
    const progress = ref({});
    const showProgress = ref(false);

    // Initial data load
    onMounted(async () => {
        await receiveAllChats();

        if (authState.selectedChatId != null) {
            selectedChatId.value = authState.selectedChatId;
            await receiveAllMessages(selectedChatId.value);
            await getSettings(selectedChatId.value);
        }
    });

    // Chat
    async function createChat(title) {
        try {
            const result = await chatService.createChat(title);
            alert(result.message);
            chats.value.unshift(result.chat.lastChatItem);
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

    async function renameChat(chatId, title) {
        const chat = chats.value.find(chat => chat.id === chatId);
        if (!chat) return;

        try {
            const result = await chatService.updateChat(chatId, title);
            alert(result.message);
            chat.title = title;
        } catch (error) {
            alert(error.message);
        }
    }

    async function deleteChat(chatId) {
        const index = chats.value.findIndex(chat => chat.id === chatId);
        if (index === -1) return;

        try {
            const result = await chatService.removeChat(chatId);
            alert(result.message);
            chats.value.splice(index, 1);
            clearSelection();
        } catch (error) {
            alert(error.message);
        }
    }

    // Selection
    function selectChat(chatId) {
        selectedChatId.value = chatId;
        authState.setSelectedChatId(chatId);
        receiveAllMessages(chatId);
        getSettings(chatId);
    }

    function clearSelection() {
        selectedChatId.value = null;
        authState.setSelectedChatId(null);
    }

    // Messages
    async function createMessage(chatId, userChatMessage, username) {
        const userMessage = {
            ...userChatMessage,
            sender: username,
            content: MarkdownUtil.renderMarkdown(userChatMessage.content),
        };
        messages.value.push(userMessage);

        const buffers = { thinking: '', content: '' };
        let lastMessageIndex = null;

        try {
            await chatMessageService.sendMessage(chatId, userChatMessage, (assistantChatMessage) => {
                // First chunk, create the assistant bubble
                if (lastMessageIndex === null) {
                    if (assistantChatMessage.thinking) {
                        buffers.thinking = assistantChatMessage.thinking;
                        assistantChatMessage.thinking = MarkdownUtil.renderMarkdown(buffers.thinking);
                    } else if (assistantChatMessage.content) {
                        buffers.content = assistantChatMessage.content;
                        assistantChatMessage.content = MarkdownUtil.renderMarkdown(buffers.content);
                    }

                    assistantChatMessage.sender = assistantChatMessage.model;
                    messages.value.push(assistantChatMessage);
                    lastMessageIndex = messages.value.length - 1;
                    return;
                }

                // Subsequent chunks, mutate the existing bubble
                const targetMessage = messages.value[lastMessageIndex];

                if (assistantChatMessage.thinking) {
                    buffers.thinking += assistantChatMessage.thinking;
                    targetMessage.thinking = MarkdownUtil.renderMarkdown(buffers.thinking);
                } else if (assistantChatMessage.content) {
                    buffers.content += assistantChatMessage.content;
                    targetMessage.content = MarkdownUtil.renderMarkdown(buffers.content);
                }

                if (assistantChatMessage.done) {
                    targetMessage.createdAt = assistantChatMessage.createdAt;
                }
            });
        } catch (error) {
            alert(error.message);
        }
    }

    async function receiveAllMessages(chatId) {
        try {
            const result = await chatMessageService.getMessages(chatId);

            result.chatMessages.forEach(message => {
                if (message.role === 'assistant') {
                    message.thinking = MarkdownUtil.renderMarkdown(message.thinking);
                    message.sender = message.model;
                } else if (message.role === 'user') {
                    message.sender = authState.user.username;
                }

                message.content = MarkdownUtil.renderMarkdown(message.content);
            });

            messages.value = result.chatMessages;
        } catch (error) {
            alert(error.message);
        }
    }

    // Settings / Metadata
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
            if (settingsObject.section === 'provider') {
                const result = await chatMetadataService.updateProvider(chatId, settingsObject);
                settings.value = result.metadata;
            } else if (settingsObject.section === 'providerConfig') {
                const result = await chatMetadataService.updateProviderConfig(chatId, settingsObject);
                settings.value.providerConfig = result.metadata.providerConfig;
                settings.value.model = result.metadata.model;
                settings.value.config = result.metadata.config;
            } else if (settingsObject.section === 'model') {
                await chatMetadataService.updateModel(chatId, settingsObject, (eventType, data) => {
                    if (eventType === 'progress') {
                        progress.value = data;
                        showProgress.value = true;
                    }
                    
                    if (eventType === 'complete') {
                        settings.value.model = data.metadata.model;
                        settings.value.config = data.metadata.config;
                    }
                });
            } else if (settingsObject.section === 'config') {
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
            const { section, ...fields } = result.metadata;

            if (section === 'provider') {
                settings.value.provider = fields.provider;
            } else if (section === 'providerConfig') {
                settings.value.providerConfig = fields.providerConfig;
            } else if (section === 'model') {
                settings.value.model = fields.model;
            } else if (section === 'config') {
                settings.value.config = fields.config;
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
            @create-message="(userChatMessage) => createMessage(selectedChatId, userChatMessage, authState.user.username)"
        />

        <ChatSettings
            :selected-id="selectedChatId"
            :settings="settings"
            @apply-settings="(settings) => applySettings(selectedChatId, settings)"
            @reset-settings="(endpoint) => resetSettings(selectedChatId, endpoint)"
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