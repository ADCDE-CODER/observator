<script setup>
	import SiteInfo from '../components/SiteInfo.vue';
</script>

<template>
    <div class="home-page">
        <section id="home">
            <h2>Welcome!</h2>
        </section>
        <footer>
            <SiteInfo/>
        </footer>
    </div>
</template>

<style scoped>
    .home-page {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    #home {
        background-color: var(--color-surface);
        color: var(--color-on-surface);
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
    }
</style>