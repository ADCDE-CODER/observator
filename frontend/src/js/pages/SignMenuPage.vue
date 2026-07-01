<script setup>
    import Card from '../components/Card.vue';
    import SignupForm from '../components/SignupForm.vue';
    import SigninForm from '../components/SigninForm.vue';
</script>

<template>
    <section class="sign-menu">
        <Card>
            <h2>Enter your information</h2>
            <SignupForm/>
            <SigninForm/>
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