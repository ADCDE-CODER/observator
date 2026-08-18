<script setup>
	import logo from "./../../assets/images/logo.png"
	import profile from "./../../assets/images/profile.png"
	import { useRouter } from "vue-router";

	const { authState } = defineProps({
		authState: Object
	});

	const router = useRouter();
	
	function goLogin() {
		router.push('/sign');
	}

	function goLogout() {
		authState.clearAllLocalStorage();
		router.push('/welcome');
	}
</script>

<template>
	<div class="navbar">
		<div class="navbar-content" v-show="!authState.user">
			<div class="navbar-logo">
				<img :src="logo" alt="logo image" @click.prevent="router.push('/welcome')">
			</div>
			<button class="primary-button" @click="goLogin()">Log in</button>
		</div>

		<div class="navbar-content" v-show="authState.user">
			<div class="navbar-logo">
				<img :src="logo" alt="logo image" @click.prevent="router.push('/welcome')">
			</div>
			<nav class="navbar-links">
				<RouterLink class="nav-link" to="/chat">Chat</RouterLink>
				<RouterLink class="nav-link" to="/image">Image</RouterLink>
				<RouterLink class="nav-link" to="/video">Video</RouterLink>
				<RouterLink class="nav-link" to="/post">Post</RouterLink>
			</nav>
			<div class="navbar-profile">
				<img :src="profile" alt="profile image">
			</div>
			<button class="secondary-button" @click="goLogout()">Log out</button>
		</div>
	</div>
</template>

<style scoped>
	.navbar {
		background-color: var(--color-surface-container);
        color: var(--color-on-surface);
		border-bottom: 1px var(--color-outline) solid; 
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 0.5rem; 
	}
	
	.navbar-content, .navbar-links {
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1em;
	}
	
	.navbar-logo, .navbar-profile {
		display: flex;
		cursor: pointer;
	}

	.nav-link {
		color: var(--color-on-surface);
		text-decoration: none;
		padding: 0.5rem;
		border-radius: 15px;
		transition: background-color 1s, color 1s;
		cursor: pointer;
	}

	.nav-link:hover, .router-link-exact-active {
		background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
	}

	.primary-button, .secondary-button {
		width: 100%;
		padding: 0.5rem;
		box-sizing: border-box;
		border: none;
		border-radius: 15px;
		cursor: pointer;
	}

	.primary-button {
		background-color: var(--color-primary);
		color: var(--color-on-primary);
		transition: background-color 1s, color 1s;
	}

	.primary-button:hover {
        background-color: var(--color-primary-container);
        color: var(--color-on-primary-container);
    }

	.secondary-button {
		background-color: var(--color-secondary);
		color: var(--color-on-secondary);
		transition: background-color 1s, color 1s;
	}

	.secondary-button:hover {
        background-color: var(--color-secondary-container);
		color: var(--color-on-secondary-container);
    }
</style>