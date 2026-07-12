<script setup>
    import { ref } from 'vue';

    const userInput = ref('');
    const emit = defineEmits(["create-message"]);
    const {selectedId, messages} = defineProps({
        selectedId: Number,
        messages: Array
    });

    function sendMessage() {
        emit('create-message', userInput.value);
        userInput.value = '';
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
            <section v-for="message in messages" :key="message.id">
                <div class="html-output" v-html="message.message"></div>
            </section>
        </div>
        <form class="input-container" @submit.prevent="sendMessage()">
            <input class="prompt-input" type="text" placeholder="Type here" v-model="userInput">
            <button class="primary-button" type="submit">Send</button>
        </form>
    </div>
</template>

<style scoped>
    .chatMessages {
        background-color: var(--color-surface-container);
        color: var(--color-on-surface);
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .output-container {
        background-color: var(--color-surface-container-high);
        width: 100%;
        height: 100%;
        margin: 0rem 1rem 1rem 1rem;
        padding: 0.5rem;
        box-sizing: border-box;
        border-radius: 15px;
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
        background-color: var(--color-surface-container-highest);
        color: var(--color-on-surface);
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 20px;
        border: 1px var(--color-outline) solid;
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