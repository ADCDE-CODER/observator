<script setup>
    import SettingsField from './SettingsField.vue';

    const emit = defineEmits(["apply-settings", "reset-settings"])
    const props = defineProps({
        selectedId: Number,
        settings: Object
    });

    function getObjectValues(object) {
        const values = {};

        for (const key in object) {
            values[key] = object[key].value
        }

        return values
    }

    function applyProvider() {
        const provider = {
            section: "provider",
            value: props.settings.provider.value
        };
        emit('apply-settings', provider);
    }

    function applyModel() {
        const model = {
            section: "model",
            value: getObjectValues(props.settings.model)
        };
        emit('apply-settings', model);
    }

    function applyConfig() {
        const config = {
            section: "config",
            value:  getObjectValues(props.settings.config)
        };
        emit('apply-settings', config);
    }
</script>

<template>
    <div class="chat-settings" v-show="!props.selectedId">
        <h2>Settings</h2>
        <div class="settings">
            <p class="output-message">
                <span>
                    Select a chat to start applying chat settings.
                </span>
            </p>
        </div>
    </div>

    <div class="chat-settings" v-show="props.selectedId">
        <h2>Settings</h2>
        <div class="settings">
            <!-- Provider -->
            <form class="form-section" @submit.prevent="applyProvider()">
                <h3 class="section-heading">Provider</h3>
                <SettingsField :section="{ provider: props.settings.provider }" />
                <div class="button-container">
                    <button class="secondary-button" type="submit">Apply</button>
                    <button class="reset-button" type="button" @click="emit('reset-settings', 'resetprovider')">⟳</button>
                </div>
            </form>

            <!-- Model -->
            <form class="form-section" @submit.prevent="applyModel()">
                <h3 class="section-heading">Model</h3>
                <SettingsField :section="{ model: props.settings.model }" />
                <div class="button-container">
                    <button class="secondary-button" type="submit">Apply</button>
                    <button class="reset-button" type="button" @click="emit('reset-settings', 'resetmodel')">⟳</button>
                </div>
            </form>

            <!-- Config -->
            <form class="form-section" @submit.prevent="applyConfig()">
                <h3 class="section-heading">Config</h3>
                <SettingsField :section="{ config: props.settings.config }" />
                <div class="button-container">
                    <button class="secondary-button" type="submit">Apply</button>
                    <button class="reset-button" type="button" @click="emit('reset-settings', 'resetconfig')">⟳</button>
                </div>
            </form>
        </div>
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

    .output-message {
        text-align: center;
        margin: auto;
    }

    .settings {
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

    .form-section {
        background-color: var(--color-surface-container-highest);
        border-radius: 20px;
        padding: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;
    }

    .button-container {
        display: flex;
        align-items: center;
        gap: 0.5em;
        width: 100%;
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

    .reset-button {
        background: none;
		color: var(--color-on-surface);
        font-size: large;
		padding: 0.5rem;
		border: none;
		border-radius: 15px;
		cursor: pointer;
        transition: background-color 1s, color 1s;
    }

    .secondary-button:hover, .reset-button:hover  {
        background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
    }
</style>