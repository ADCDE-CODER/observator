<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { authState } from '../state/authState';
    import { readAccount } from '../services/authService';

    const email = ref('');
    const password = ref('');
    const router = useRouter();
   
    async function doSignin() {        
        const response = await readAccount(email.value, password.value);
        if (response.ok && response.success) {
            email.value = '';
            password.value = '';
            
            authState.setUser(response.user);
            authState.setToken(response.token);
            router.push('/chat');
        }
    }
</script>

<template>
    <section>
        <h2>Sign in</h2>
        <form @submit.prevent="doSignin()">
            <input class="email-input" type="email" placeholder="Email" v-model="email"/>
            <input class="password-input" type="password" placeholder="Password" v-model="password"/>
            <button class="primary-button" type="submit">Sign up</button>
        </form>
    </section>
</template>

<style scoped>
    h2 {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .email-input, .password-input, .primary-button {
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

    .primary-button {
		background-color: var(--color-primary);
		color: var(--color-on-primary);
        border: none;
        cursor: pointer;
	}
</style>