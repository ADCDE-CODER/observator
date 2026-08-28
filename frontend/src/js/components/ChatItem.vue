<script setup>
    import { nextTick, onMounted, onUnmounted, ref } from 'vue';

    const dropdownButton = ref(null);
    const dropdown = ref(null);
    const dropdownStyle = ref({
        top: '0px',
        left: '0px'
    });
    const emit = defineEmits(["select-chat", 'toggle-dropdown', "rename-chat", "delete-chat"]);
    const {chat, isChatActive, isDropdownActive, scrollContainer} = defineProps({
        chat: Object,
        isChatActive: Boolean,
        isDropdownActive: Boolean,
        scrollContainer: Object
    });

    onMounted(() => {
        scrollContainer.addEventListener('scroll', updateDropdownPosition);
    });

    onUnmounted(() => {
        scrollContainer.removeEventListener('scroll', updateDropdownPosition);
    });

    function selectChat() {
        emit('select-chat', chat.id)
    }

    async function toggleDropdown() {
        emit('toggle-dropdown', chat.id);
        await nextTick();
        updateDropdownPosition();
    }

    function onRename() {
        const title = prompt("Please enter to change chat title");
        emit('rename-chat', chat.id, title);
    }

    function onDelete() {
        if (confirm("Do you want delete chat and messages forever?")) {
            emit('delete-chat', chat.id);
        }
    }

    function updateDropdownPosition() {
        if (!dropdownButton.value || !dropdown.value) {
            return;
        }

        const buttonRect = dropdownButton.value.getBoundingClientRect();
        const dropdownRect = dropdown.value.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const DROPDOWN_OFFSET_X = 100;
        const DROPDOWN_OFFSET_Y = 0;
        
        let top = null;

        if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
            // Not enough room below -> open above
            top = buttonRect.top - dropdownRect.height- DROPDOWN_OFFSET_Y;
        } else {
            /// Enough room below -> open below
            top = buttonRect.bottom + DROPDOWN_OFFSET_Y;
        }

        let left = buttonRect.right - dropdownRect.width + DROPDOWN_OFFSET_X;

        // Keep inside left side of viewport
        if (left < 8) {
            left = 8;
        }

        // Keep inside right side of viewport
        if (left + dropdownRect.width > window.innerWidth - 8) {
            left = window.innerWidth - dropdownRect.width - 8;
        }

        dropdownStyle.value = {
            top: `${top}px`,
            left: `${left}px`
        }
    }
</script>

<template>
    <button class="chatButton" :class="{chatActive: isChatActive}" @click.stop="selectChat()">
        {{chat.title}}
        <button class="dropdown-button" @click.stop="toggleDropdown()" ref="dropdownButton">...</button>
        <Teleport to="body">
            <div  v-if="isDropdownActive" class="dropdown-content" :style="dropdownStyle" ref="dropdown">
                <button class="dropdown-option" @click.stop="onRename()">Rename</button>
                <button class="dropdown-option" @click.stop="onDelete()">Delete</button>
            </div>
        </Teleport>
    </button>
</template>

<style scoped>
    .chatButton {
        color: var(--color-on-surface);
        background: none;
        border: none;
		padding: 0.5rem;
		border-radius: 15px;
        cursor: pointer; 
		transition: background-color 1s, color 1s;
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
    }

    .chatButton:hover {
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
        gap: 10px;
        padding: 0.5rem;
        border-radius: 15px;
        position: fixed;
        display: flex;
        flex-direction: column;
    }

    .dropdown-option {
        color: var(--color-on-surface);
        background: none;
        border: none;
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