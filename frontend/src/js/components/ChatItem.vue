<script setup>
    import { nextTick, onMounted, onUnmounted, ref } from 'vue';
    import TrashIcon from './TrashIcon.vue';

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
        if (title !== null) {
            emit('rename-chat', chat.id, title);
        }
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
        const DROPDOWN_OFFSET_X = 95;
        const DROPDOWN_OFFSET_Y = -35;
        
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
    <div class="button-container" :class="{chatActive: isChatActive}">
        <button class="chatButton" @click="selectChat()">
            <span>
                {{chat.title}}
            </span>
        </button>
        <button class="dropdown-button" :class="{dropdownActive: isDropdownActive}" @click="toggleDropdown()" ref="dropdownButton">•••</button>
        <Teleport to="body">
            <div  v-if="isDropdownActive" class="dropdown-content" :style="dropdownStyle" ref="dropdown">
                <button class="dropdown-option" @click.stop="onRename()">Rename</button>
                <button class="dropdown-option delete-option" @click.stop="onDelete()">
                    <TrashIcon width="15" height="15" aria-label="Trash icon"/>Delete
                </button>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
    .button-container {
        display: flex;
        justify-content: space-between;
		border-radius: 15px;        
		transition: background-color 1s, color 1s;
    }

    .button-container:hover, .chatActive {
        background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
    }

    .chatButton {
        color: var(--color-on-surface);
        background: none;
        border: none;
        cursor: pointer;
        padding: 1rem;
        flex-grow: 1;
    }

    .dropdown-button {
        background-color: transparent;
        color: var(--color-on-surface);
		border-radius: 15px;
        border: none;
        cursor: pointer;
        padding: 1rem;
        transition: background-color 1s, color 1s;
    }

    .dropdown-button:hover, .dropdownActive {
        background-color: var(--color-primary-container);
		color: var(--color-on-primary-container);
    }
    
    .dropdown-content {
        background-color: var(--color-surface-container);
        padding: 0.5rem;
        border-radius: 15px;
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .dropdown-option {
        background-color: transparent;
        color: var(--color-on-surface);
        border: none;
        padding: 8px 12px;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background-color 1s, color 1s;
        cursor: pointer;
    }

    .dropdown-option:hover {
        background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
    }

    .delete-option {
        color: red;
        --icon-color: red;
    }

    .delete-option:hover {
        background-color: rgba(255, 0, 0, 0.25);
        color: red;
        --icon-color: red;
    }
</style>