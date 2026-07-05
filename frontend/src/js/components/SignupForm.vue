<script setup>
    import { ref } from 'vue';
    import { createAccount } from '../services/authService';

    const email = ref('');
    const password = ref('');

    async function doSignup() {
        const result = await createAccount(email.value, password.value);
        if (result.ok && result.success) {
            email.value = '';
            password.value = '';
        }
    }
</script>

<template>
    <section>
        <h2>Sign up</h2>
        <form @submit.prevent="doSignup()">
            <input class="email-input" type="email" placeholder="Email" v-model="email"/>
            <input class="password-input" type="password" placeholder="Password" v-model="password"/>
            <button class="secondary-button" type="submit">Sign up</button>
        </form>
    </section>
</template>

<style scoped>
    h2 {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .email-input, .password-input, .secondary-button {
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 20px;
    }

    .email-input, .password-input {
        background-color: var(--color-surface-container-highest);
        color: var(--color-on-surface);
        border: 1px var(--color-outline) solid;
        margin: 0rem 0rem 1rem 0rem;
    }

    .secondary-button {
		background-color: var(--color-secondary);
		color: var(--color-on-secondary);
        border: none;
        cursor: pointer;
		transition: background-color 1s, color 1s;
	}

	.secondary-button:hover {
        background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
    }
</style>