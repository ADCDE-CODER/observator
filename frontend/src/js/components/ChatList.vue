<script setup>
    import { onMounted, onUnmounted, ref } from 'vue';
    import ChatItem from './ChatItem.vue';

    const chatList = ref(null);
    const selectedDropdownId = ref(null);
    const emit = defineEmits(["select-chat", "clear-selection", "create-chat", "rename-chat", "delete-chat"]);
    const {chats, selectedChatId} = defineProps({
        chats: Array,
        selectedChatId: Number
    });

    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    function handleClickOutside(event) {
        if (chatList.value && !chatList.value.contains(event.target)) {
            selectedDropdownId.value = null;
        }
    }

    function toggleDropdown(chatId) {
        if(selectedDropdownId === chatId) {
            selectedDropdownId.value = null;
        } else {
            selectedDropdownId.value = chatId
        }
    }
</script>

<template>
    <div class="chat-list" v-show="chats.length === 0">
        <h2>Chats</h2>
        <button class="new-chat-button" @click="emit('create-chat')">New chat</button>
        <aside class="list">
            <p class="output-message">
                <span>
                    Create a new chat to start sending messages.
                </span>
            </p>
        </aside>
    </div>

    <div class="chat-list" @click="emit('clear-selection')" v-show="chats.length !== 0" >
        <h2>Chats</h2>
        <button class="new-chat-button" @click="emit('create-chat')">New chat</button>
        <aside class="list" ref="chatList">
            <ChatItem 
            v-for="chat in chats" 
            :key="chat.id" 
            :chat="chat" 
            :is-chat-active="selectedChatId === chat.id"
            :is-dropdown-active="selectedDropdownId === chat.id"
            :scroll-container="chatList"
            @select-chat="(id) => emit('select-chat', id)" 
            @toggle-dropdown="(id) => toggleDropdown(id)"
            @delete-chat="(id) => emit('delete-chat', id)"
            @rename-chat="(id, title) => emit('rename-chat', id, title)"
            @click.stop
            />
        </aside>
    </div>
</template>

<style scoped>
    .chat-list {
        background-color: var(--color-surface-container);
        color: var(--color-on-surface);
        display: flex;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: clamp(250px, 15vw, 400px);
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .output-message {
        text-align: center;
        margin: auto;
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
        height: 100%;
        overflow-y: auto;
    }
</style>