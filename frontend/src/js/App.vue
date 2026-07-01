<script setup>
	import NavbarPage from './components/Navbar.vue';
	import { useRouter } from 'vue-router';
	import { authState } from './state/authState.js';

	const router = useRouter();
	authState.loadLocalStorage();
	
	if (authState.user != null) {
		router.push('/chat');
	} else {
		router.push('/welcome');
	}
</script>

<template>
	<header>
		<NavbarPage/>
	</header>
	<main id="content-main">
		<RouterView/>
	</main>
	<footer></footer>
</template>

<style scoped>
	#content-main {
		background-color: red;
		overflow: auto;
	}
</style>
