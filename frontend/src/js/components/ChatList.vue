<script setup>
    import ChatItem from './ChatItem.vue';

    const emit = defineEmits(["select-chat", "create-chat", "rename-chat", "delete-chat"]);
    const {chats, selectedChatId} = defineProps({
        chats: Array,
        selectedChatId: Number
    });
</script>

<template>
    <div class="list-chat">
        <h2>Chats</h2>
        <button class="new-chat-button" @click="emit('create-chat')">New chat</button>
        <aside class="list">
            <ChatItem v-for="chat in chats" 
            :key="chat.id" 
            :chat="chat" 
            :isChatActive="selectedChatId === chat.id" 
            @select-chat="(id) => emit('select-chat', id)" 
            @delete-chat="(id) => emit('delete-chat', id)"
            @rename-chat="(id, title) => emit('rename-chat', id, title)"
            />
        </aside>
    </div>
</template>

<style scoped>
    .list-chat {
        background-color: var(--color-surface-container);
        color: var(--color-on-surface);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        flex-shrink: 0;
        width: clamp(200px, 15%, 300px);
    }

    .new-chat-button {
        background-color: var(--color-primary);
		color: var(--color-on-primary);
        border: none;
        cursor: pointer;
        min-width: 90%;
        padding: 1rem;
        border-radius: 20px;
        transition: background-color 1s, color 1s;
    }

    .new-chat-button:hover {
        background-color: var(--color-primary-container);
        color: var(--color-on-primary-container);
    }

    .list {
        background-color: var(--color-surface-container-high);
        margin: 1rem;
        padding: 0.5rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        border-radius: 15px;
        gap: 1em;
        min-width: 90%;
        overflow-y: auto;
    }
</style>