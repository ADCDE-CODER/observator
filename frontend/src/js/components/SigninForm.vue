<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { authState } from '../state/authState';
    import { readAccount } from '../services/userService';

    const email = ref('');
    const password = ref('');
    const router = useRouter();
   
    async function doSignin() {        
        const user = {
            email: email.value, 
            password: password.value
        };
        
        try {
            const result = await readAccount(user);
            alert(result.message);
            
            email.value = '';
            password.value = '';
            
            authState.setUser(result.user);
            authState.setToken(result.user.token);
            router.push('/chat');
        } catch (error) {
            alert(error.message);
        }
    }
</script>

<template>
    <section>
        <h2>Sign in</h2>
        <form @submit.prevent="doSignin()">
            <input class="input" type="email" placeholder="Email" v-model="email"/>
            <input class="input" type="password" placeholder="Password" v-model="password"/>
            <button class="primary-button" type="submit">Sign in</button>
        </form>
    </section>
</template>

<style scoped>
    h2 {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .input, .primary-button {
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        border-radius: 20px;
    }

    .input {
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
		transition: background-color 1s, color 1s;
	}

	.primary-button:hover {
        background-color: var(--color-primary-container);
        color: var(--color-on-primary-container);
    }
</style>