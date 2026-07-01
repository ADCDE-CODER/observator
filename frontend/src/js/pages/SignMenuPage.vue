<script setup>
    import { useRouter } from 'vue-router';
    import { createAccount, readAccount } from '../services/authService';
    import { authState } from '../state/authState';

    const router = useRouter();

    async function doSignup() {
        const emailInput = document.getElementById("create-email");
        const passwordInput = document.getElementById("create-password");
        
        const result = await createAccount(emailInput.value, passwordInput.value);
        if (result.ok && result.success) {
            emailInput.value = "";
            passwordInput.value = "";
        }
    }

    async function doSignin() {
        const emailInput = document.getElementById("read-email");
        const passwordInput = document.getElementById("read-password");
        
        const response = await readAccount(emailInput.value, passwordInput.value);
        if (response.ok && response.success) {
            emailInput.value = "";
            passwordInput.value = "";
            
            authState.setUser(response.user);
            authState.setToken(response.token);
            router.push('/chat');
        }
    }
</script>

<template>
    <section id="sign-menu" class="content-main__page">
        <div class="card">
            <h2>Enter your information</h2>
            <section class="menu">
                <h2>Sign up</h2>
                <div class="menu__label">
                    <label for="create-email">Email</label>
                    <input id="create-email" type="text" name="create-email" placeholder="Email">
                </div>
                <div class="menu__label">
                    <label for="create-password">Password</label>
                    <input id="create-password" type="text" name="create-password" placeholder="Password">
                </div>
                <button id="signup-button" @click="doSignup()">Sign up</button>
            </section>
            <section class="menu">
                <h2>Sign in</h2>
                <div class="menu__label">
                    <label for="read-email">Email</label>
                    <input id="read-email" type="text" name="read-email" placeholder="Email">
                </div>
                <div class="menu__label">
                    <label for="read-password">Password</label>
                    <input id="read-password" type="text" name="read-password" placeholder="Password">
                </div>
                <button id="signin-button" @click="doSignin()">Sign in</button>
            </section>
        </div>
    </section>
</template>

<style scoped>
    #sign-menu {
        background-color: var(--color-surface);
        color: var(--color-on-surface);
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        overflow: scroll;
        width: 100%;
        height: 100%;
    }

    .card {
        background-color: #212121;
        box-shadow: 0 0 #ffff, 0px 2px 14px rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        position: absolute;
        padding: 2rem;
        width: 25%;
    }

    .card > h2, .menu > h2 {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .menu, .menu__label {
        margin: 1rem 0rem;
    }

    .menu__label > input, .menu > button {
        width: 100%;
        box-sizing: border-box;
        border: none;
        padding: 1rem;
        border-radius: 10px;
    }
</style>