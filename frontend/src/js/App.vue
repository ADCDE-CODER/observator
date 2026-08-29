<script setup>
	import NavbarPage from './components/Navbar.vue';
	import { useRouter } from 'vue-router';
	import { authState } from './state/authState.js';

	const router = useRouter();
	authState.loadLocalStorage();
	
	if (authState.user != null) {
		router.push('/chat');
	} else {
		router.push('/');
	}
</script>

<template>
	<header>
		<NavbarPage :auth-state="authState"/>
	</header>
	<main id="content-main">
		<RouterView/>
	</main>
	<footer></footer>
</template>

<style scoped>
	#content-main {
		background-color: var(--color-surface-container);
		overflow: auto;
	}
</style>
