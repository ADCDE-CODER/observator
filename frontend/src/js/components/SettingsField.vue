<script setup>
    const props = defineProps({
        section: {
            type: Object,
            required: true
        } 
    });

    function isField(value) {
        if (!value) {
            return false;
        }

        if (typeof value !== 'object') {
            return false;
        }

        if (!('type' in value)) {
            return false;
        }

        if (!('value' in value)) {
            return false;
        }

        return true;
    }
</script>

<template >
    <template v-for="(item, key) in props.section" :key="key">
        <div class="field" v-if="isField(item)">        
            <label>{{ item.label }}:</label>
            
            <!-- TEXT / NUMBER / DATE / RANGE -->
            <input 
                v-if="['text', 'number', 'date', 'range'].includes(item.type)"
                :class="item.type" 
                :type="item.type" 
                :placeholder="item.placeholder" 
                :min="item.min" 
                :max="item.max"
                :step="item.step"
                v-model="item.value"
            />
    
            <!-- TEXTAREA -->
            <textarea 
                v-else-if="item.type === 'textarea'" 
                v-model="item.value" 
                :placeholder="item.placeholder"
            ></textarea>
    
            <!-- SELECT -->
            <select v-else-if="item.type === 'select'" :disabled="item.disabled" v-model="item.value">
                <option v-for="(option, index) in item.options" :key="index" :value="option">
                    {{ option }}
                </option>
            </select>
    
            <!-- RADIO -->
            <div v-else-if="item.type === 'radio'">
                <label v-for="(option, index) in item.options" :key="index">
                    {{ option }}:
                    <input :type="item.type" v-model="item.value" :value="option"/>
                </label>
            </div>
    
            <!-- CHECKBOX -->
            <input 
                v-else-if="item.type === 'checkbox'" 
                :class="item.type" 
                :type="item.type" 
                :item="item.value"
                v-model="item.value" 
            />
        </div>
    </template>
</template>

<style scoped>
    .field {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-bottom: 0.5rem;
    }

    label {
        text-align: center;
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
</style>