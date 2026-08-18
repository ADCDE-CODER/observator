<script setup>
    import { ref } from 'vue';

    const email = ref('');
    const password = ref('');
    const emit = defineEmits(["read-user"]);

    async function sendUser() {        
        const user = {
            email: email.value, 
            password: password.value
        };
        
        emit("read-user", user);
        email.value = '';
        password.value = '';
    }
</script>

<template>
    <section>
        <h2>Sign in</h2>
        <form @submit.prevent="sendUser()">
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