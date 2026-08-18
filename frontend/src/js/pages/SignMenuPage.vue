<script setup>
    import Card from '../components/Card.vue';
    import SignupForm from '../components/SignupForm.vue';
    import SigninForm from '../components/SigninForm.vue';
    import { useRouter } from 'vue-router';
    import { readAccount } from '../services/userService';
    import { authState } from '../state/authState.js';

    const router = useRouter();

    async function doSignin(user) {                
        try {
            const result = await readAccount(user);
            alert(result.message);

            authState.setUser(result.user);
            authState.setToken(result.user.token);
            router.push('/chat');
        } catch (error) {
            alert(error.message);
        }
    }
</script>

<template>
    <section class="sign-menu">
        <Card>
            <h2>Enter your information</h2>
            <SignupForm/>
            <SigninForm @read-user="(user) => doSignin(user)"/>
        </Card>
    </section>
</template>

<style scoped>
    .sign-menu {
        background-color: var(--color-surface);
        color: var(--color-on-surface);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: scroll;
    }

    h2 {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>