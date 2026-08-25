<script setup>
    const emit = defineEmits(["apply-settings"])
    const {selectedId, settings} = defineProps({
        selectedId: Number,
        settings: Array
    });

    function applySettings() {
        const result = {};

        settings.forEach(section => {
            section.inputs.forEach( input => {
                result[input.name] = input.value; 
            })
        });

        emit('apply-settings', result);
    }
</script>

<template>
    <div class="chat-settings" v-show="!selectedId">
        <h2>Settings</h2>
        <div class="settings">
            <p class="output-message">
                <span>
                    Select a chat to start applying chat settings.
                </span>
            </p>
        </div>
    </div>

    <div class="chat-settings" v-show="selectedId">
        <h2>Settings</h2>
        <form class="settings" @submit.prevent="applySettings()">
            <div class="section" v-for="section in settings">
                <h3 class="section-heading">{{section.title}}</h3>

                <div v-for="input in section.inputs">
                    <label>{{ input.label }}: </label>
                    
                    <!-- TEXT / NUMBER / DATE / RANGE -->
                    <input 
                    v-if="['text', 'number', 'date', 'range'].includes(input.type)" 
                    :class="input.type" 
                    :type="input.type" 
                    :placeholder="input.placeholder" 
                    :min="input.min" 
                    :max="input.max"
                    :step="input.step"
                    v-model="input.value" 
                    >

                    <!-- TEXTAREA -->
                    <textarea 
                    v-else-if="input.type === 'textarea'"
                    :placeholder="input.placeholder"
                    v-model="input.value"
                    ></textarea>

                    <!-- SELECT -->
                    <select
                    v-else-if="input.type === 'select'"
                    v-model="input.value"    
                    >
                        <option
                        v-for="option in input.options"
                        :key="option"
                        :value="option"
                        >
                            {{ option }}
                        </option>
                    </select>

                    <!-- RADIO -->
                    <div v-else-if="input.type === 'radio'">
                        <label
                        v-for="option in input.options"
                        :key="option"
                        >
                            {{ option }}:

                            <input
                            type="radio"
                         
                            :value="option"
                            v-model="input.value"
                            />
                        </label>
                    </div>

                    <!-- CHECKBOX -->
                    <input
                    v-else-if="input.type === 'checkbox'"
                    :class="input.type"
                    type="checkbox"
                    v-model="input.value"
                    />
                </div>
            </div>

            <button class="secondary-button" type="submit">Apply</button>
        </form>
    </div>
</template>

<style scoped>
    .chat-settings {
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

    .settings{
        background-color: var(--color-surface-container-high);
        margin: 0rem 1rem 1rem 1rem;
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

    .output-message {
        text-align: center;
        margin: auto;
    }

    .section {
        background-color: var(--color-surface-container-highest);
        border-radius: 20px;
        padding: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;
    }

    .section-heading {
        margin: 1rem 0rem 0rem 0rem;
    }

    .section > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .number, .text, select {
        background-color: var(--color-surface-container-highest);
        color: var(--color-on-surface);
        border: 1px var(--color-outline) solid;
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 20px;
    }

    .checkbox {
        background-color: var(--color-surface-container-highest);
        color: var(--color-on-surface);
        border: 1px var(--color-outline) solid;
        width: 25px;
        height: 25px;
    }

   .secondary-button {
        background-color: var(--color-secondary);
		color: var(--color-on-secondary);
		width: 100%;
		padding: 0.5rem;
		box-sizing: border-box;
		border: none;
		border-radius: 15px;
		cursor: pointer;
        transition: background-color 1s, color 1s;
	}

    .secondary-button:hover {
        background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
    }
</style>