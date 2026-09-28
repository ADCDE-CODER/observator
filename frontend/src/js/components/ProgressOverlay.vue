<script setup>
    import { computed } from 'vue'

    const emit = defineEmits(["close"])
    const { showProgress, progress } = defineProps({
        showProgress: Boolean,
        progress: Object
    });
    
    const percentage = computed(() => {
        if (!progress.completed || !progress.total) {
            return 0
        }
        
        return Math.round((progress.completed / progress.total) * 100);
    });

    const isSuccessful = computed(() => {
        return progress.status !== 'success';
    });
</script>

<template>
    <div class="progress-overlay" v-show="showProgress">
        <div class="progress">

            <div class="progress-header">
                <span>{{ isSuccessful ? "Pulling a model..." : "Successfully pulled the model!" }}</span>
                <span v-show="percentage > 0">{{ percentage }}%</span>
            </div>

            <div class="progress-bar" v-show="percentage > 0">
                <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
            </div>

            <div class="progress-info" v-show="progress">
                <span v-show="progress.completed, progress.total">
                    Progress: {{ progress.completed }} / {{ progress.total }}
                </span>

                <span v-show="progress.status">
                    Status: {{ progress.status }}
                </span>
            </div>

            <button class="primary-button" :disabled="isSuccessful" @click="emit('close')">
                {{ isSuccessful ? "Pulling..." : "Close" }}
            </button>

        </div>
    </div>
</template>

<style scoped>
    .progress-overlay {
        background-color: color-mix(in srgb, var(--color-surface-container) 20%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;   
        position: fixed;
        inset: 0;
    }

    .progress {
        background-color: var(--color-surface-container);
        color: var(--color-on-surface);
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 1rem;
        border: 1px solid var(--color-outline);
        border-radius: 15px;
        width: min(500px, calc(100% - 40px));
    }

    .progress-header {
        display: flex;
        justify-content: space-between;
    }

    .progress-bar {
        background: white;
        width: 100%;
        height: 1rem;
        border-radius: 15px;
        overflow: hidden;
    }

    .progress-fill {
        background: #42b883;
        height: 100%;
        transition: width 0.2s ease;
    }

    .progress-info {
        font-size: 14px;
        color: darkgrey;
        margin: auto;
    }

    .primary-button {
        background-color: var(--color-primary);
		color: var(--color-on-primary);
        width: 100%;
        padding: 0.5rem;
        border: none;
        border-radius: 15px;
        cursor: pointer;
        transition: background-color 1s, color 1s;
    }

    .primary-button:hover {
        background-color: var(--color-primary-container);
        color: var(--color-on-primary-container);
    }

    .primary-button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
</style>