<script setup>
	import logo from "./../../assets/images/logo.png"
	import profile from "./../../assets/images/profile.png"
	import { authState } from "../state/authState";
	import { useRouter } from "vue-router";

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
	<div class="nav-header">
		<div class="nav-header__content" v-show="!authState.user">
			<div class="nav-header__logo">
				<img :src="logo" alt="logo image" @click.prevent="router.push('/welcome')">
			</div>
			<button class="primary" @click="goLogin()">Log in</button>
		</div>

		<div class="nav-header__content" v-show="authState.user">
			<div class="nav-header__logo">
				<img :src="logo" alt="logo image" @click.prevent="router.push('/welcome')">
			</div>
			<nav class="nav-header__menu">
				<RouterLink class="nav-link" to="/chat">Chat</RouterLink>
				<RouterLink class="nav-link" to="/image">Image</RouterLink>
				<RouterLink class="nav-link" to="/video">Video</RouterLink>
				<RouterLink class="nav-link" to="/post">Post</RouterLink>
			</nav>
			<div class="nav-header__profile">
				<img :src="profile" alt="profile image">
			</div>
			<button class="secondary" @click="goLogout()">Log out</button>
		</div>
	</div>
</template>

<style scoped>
	.nav-header {
		background-color: var(--color-surface-container);
        color: var(--color-on-surface);
		border-bottom: 1px var(--color-outline) solid; 
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 0.5rem; 
	}
	
	.nav-header__content, .nav-header__menu {
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1em;
	}
	
	.nav-header__logo, .nav-header__profile {
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

	.primary, .secondary {
		width: 100%;
		padding: 0.5rem;
		box-sizing: border-box;
		border: none;
		border-radius: 15px;
		cursor: pointer;
	}

	.primary {
		background-color: var(--color-primary);
		color: var(--color-on-primary);
	}

	.secondary {
		background-color: var(--color-secondary);
		color: var(--color-on-secondary);
	}
</style>