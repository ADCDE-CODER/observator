<script setup>
    import { onMounted, ref } from 'vue';
    
    const isDropdownActive = ref(false);
    const dropdown = ref(null);
    const emit = defineEmits(["select-chat", "rename-chat", "delete-chat"]);
    const {chat, isChatActive} = defineProps({
        chat: Object,
        isChatActive: Boolean
    });

    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    function handleClickOutside(event) {
        if (isDropdownActive.value && !dropdown.value.contains(event.target)) {
            showDropdown();
        }
    }

    function showDropdown() {
        isDropdownActive.value = !isDropdownActive.value;
    }

    function onRename() {
        const title = prompt("Please enter to change chat title");

        if(title) {
            if (title.length !== 0) {
                emit('rename-chat', chat.id, title);
            } else {
                alert("No empty value!")
            }
        }
    }

    function onDelete() {
        if (confirm("Do you want delete chat and messages forever?")) {
            document.removeEventListener('click', handleClickOutside);
            emit('delete-chat', chat.id);
        }
    }
</script>

<template>
    <a class="chat" :class="{chatActive: isChatActive}" @click="emit('select-chat', chat)">
        {{chat.title}}
        <button class="dropdown-button" @click.stop="showDropdown()">...</button>
        <div class="dropdown-content" :class="{dropdownActive: isDropdownActive}" ref="dropdown">
            <a class="dropdown-option" @click="onRename()">Rename</a>
            <a class="dropdown-option" @click="onDelete()">Delete</a>
        </div>
    </a>
</template>

<style scoped>
    .chat {
        color: var(--color-on-surface);
        text-decoration: none;
		padding: 0.5rem;
		border-radius: 15px;
        cursor: pointer; 
		transition: background-color 1s, color 1s;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
    }

    .chat:hover {
        background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
    }

    .chatActive {
        background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
    }

    .dropdown-button {
        background-color: transparent;
        color: var(--color-on-surface);
        padding: 0.5rem;
		border-radius: 15px;
        border: none;
        cursor: pointer;
        transition: background-color 1s, color 1s;
    }

    .dropdown-button:hover {
        background-color: var(--color-secondary-container-high);
		color: var(--color-on-secondary-container);
    }
    
    .dropdown-content {
        background-color: var(--color-surface-container);
        top: 100%;
        right: 0%;
        gap: 10px;
        padding: 0.5rem;
        border-radius: 15px;
        position: absolute;
        display: none;
        flex-direction: column;
        z-index: 1;
    }

    .dropdownActive {
        display: flex;
    }

    .dropdown-option {
        color: var(--color-on-surface);
        text-decoration: none;
        padding: 8px 12px;
        border-radius: 15px;
        transition: background-color 1s, color 1s;
        cursor: pointer;
    }

    .dropdown-option:hover {
        background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
    }
</style>