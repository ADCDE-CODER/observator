<script setup>
    import { ref } from 'vue';
    import { DateUtil } from '../utils/DateUtil';
    
    const userInput = ref(null);
    const userInputContext = ref('');
    const emit = defineEmits(["create-message"]);
    const {selectedId, messages} = defineProps({
        selectedId: Number,
        messages: Array
    });

    function handleKeydown(event) {
        // If Enter is pressed and Shift is NOT held down, then send a message
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        } 
        
        // If Enter is pressed and Shift IS held down, then do nothing
    }

    const MAX_ROWS = 5;

    const autoHeight = () => {
        const styles = getComputedStyle(userInput.value);

        // Reset height so shrinking works when deleting text
        userInput.value.style.height = 'auto';

        const lineHeight = parseFloat(styles.lineHeight);
        
        // Fallback if line-height is "normal"
        let actualLineHeight;
        if (isNaN(lineHeight)) {
            actualLineHeight = parseFloat(styles.fontSize) * 1.2;
        } else {
            actualLineHeight = lineHeight;
        }
        
        const padding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
        const maxHeight = actualLineHeight * MAX_ROWS + padding;
        const newHeight = Math.min(userInput.value.scrollHeight, maxHeight);

        userInput.value.style.height = `${newHeight}px`;
        
        if (userInput.value.scrollHeight > maxHeight) {
            userInput.value.style.overflowY = 'auto';
        } else {
            userInput.value.style.overflowY = 'hidden';
        }
    };

    function sendMessage() {
        const userChatMessage = {
            role: "user",
            content: userInputContext.value,
            images: null,
            createdAt: new Date().toISOString()
        };
        
        emit('create-message', userChatMessage);
        userInputContext.value = '';
        userInput.value.style.height = 'auto';
    }
</script>

<template>
    <div class="chatMessages" v-show="!selectedId">
        <h2>Message</h2>
        <div class="output-container">
            <p>
                <span>
                    Select a chat to start messaging.
                </span>
            </p>
        </div>
    </div>

    <div class="chatMessages" v-show="selectedId">
        <h2>Message</h2>
        <div class="output-container">
            <section v-for="message in messages" :key="message.id" :class="message.role">
                <strong>{{ message.sender }}:</strong>

                <details v-if="message.thinking" class="thinking-dropdown" @toggle="message.showThinking = $event.target.open">
                    <summary>{{ message.showThinking ? 'Hide thinking' : 'Show thinking' }}</summary>
                    <div class="html-output thinking-content" v-html="message.thinking"></div>
                </details>
                
                <div class="html-output" v-html="message.content"></div>
                <div class="created-at">{{ DateUtil.formatDateTime(message.createdAt) }}</div>
            </section>
        </div>
        <div class="input-container">
            <textarea class="prompt-input" type="text" placeholder="Type here" rows="1" ref="userInput" v-model="userInputContext" @keydown="handleKeydown($event)" @input="autoHeight()"></textarea>
            <button class="primary-button" type="button" @click="sendMessage()">Send</button>
        </div>
    </div>
</template>

<style scoped>
    .chatMessages {
        background-color: var(--color-surface-container);
        color: var(--color-on-surface);
        display: flex;
        flex-grow: 0;
        width: 100%;
        min-width: 400px;
        flex-direction: column;
        align-items: center;
    }

    .output-container {
        background-color: var(--color-surface-container-high);
        width: 100%;
        height: 100%;
        margin: 0rem 1rem 1rem 1rem;
        padding: 0.5rem;
        box-sizing: border-box;
        border-radius: 15px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .user, .assistant {
        padding: 1rem;
        border-radius: 20px;
        max-width: 80%;
    }

    .user {
        background-color: var(--color-primary-container);
        color: var(--color-on-primary-container);
        margin-left: auto;
    }

    .assistant {
        background-color: var(--color-surface-container-highest);
        color: var(--color-on-surface);
    }

    .thinking-dropdown {
        margin: 10px 0px;
    }

    summary {
        color: var(--color-on-surface);
        cursor: pointer;
        user-select: none;
        font-size: 14px;
    }

    .thinking-content {
        padding: 10px;
        border-left: 3px solid var(--color-on-surface);
    }

    .html-output {
        overflow-x: auto;
    }

    .created-at {
        display: block;
        margin-top: 8px;
        font-size: 0.75em;
        color: var(--color-on-surface);
        text-align: right;
    }
    
    .input-container {
        background-color: var(--color-surface-container-high);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: 0rem 1rem 1rem 1rem;
        padding: 0.5rem;
        box-sizing: border-box;
        border-radius: 15px;
        gap: 1em;
    }

    .prompt-input {
        background-color: var(--color-surface-container-high);
        color: var(--color-on-surface);
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 20px;
        border: none;
        resize: none;
        overflow-y: hidden;
        line-height: normal;
    }

    .primary-button {
        background-color: var(--color-primary);
		color: var(--color-on-primary);
        border: none;
        cursor: pointer;
        min-width: 10%;
        padding: 1rem;
        border-radius: 20px;
        transition: background-color 1s, color 1s;
    }

    .primary-button:hover {
        background-color: var(--color-primary-container);
        color: var(--color-on-primary-container);
    }

    .html-output:deep(table) {
        border-collapse: collapse;
        width: 100%;
    }

    .html-output:deep(th) {
        background-color: var(--color-primary-container);
    }

    .html-output:deep(th), .html-output:deep(td) {
        border: 1px var(--color-outline) solid;
        padding: 1rem;
    }
</style>