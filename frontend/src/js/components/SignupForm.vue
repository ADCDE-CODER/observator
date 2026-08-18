<script setup>
    import { ref } from 'vue';

    const email = ref('');
    const username = ref('');
    const password = ref('');
    const emit = defineEmits(["create-user"]);

    async function sendUser() {
        const user = {
            email: email.value, 
            username: username.value, 
            password: password.value
        };

        emit("create-user", user);
        email.value = '';
        username.value = '';
        password.value = '';
    }
</script>

<template>
    <section>
        <h2>Sign up</h2>
        <form @submit.prevent="sendUser()">
            <input class="input" type="email" placeholder="Email" v-model="email"/>
            <input class="input" type="text" placeholder="Username" v-model="username"/>
            <input class="input" type="password" placeholder="Password" v-model="password"/>
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

    .input, .secondary-button {
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