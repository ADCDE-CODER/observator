<script setup>
	import logo from "./../../assets/images/logo.png"
	import profile from "./../../assets/images/profile.png"
	import { ref } from "vue";
	import { authState } from "../state/authState";
	import { useRouter } from "vue-router";

	const logoAlt = ref("logo image");
	const profileAlt = ref("profile image");
	const router = useRouter();

	function goLogin() {
		router.push('/sign');
	}

	function goLogout() {
		authState.clearAllLocalStorage();
		router.push('/welcome');
	}
			
	console.log({...localStorage});
</script>

<template>
	<header id="nav-header" v-show="!authState.user">
		<div class="nav-header__content">
			<div id="nav-header__logo">
				<img id="logo" :src="logo" :alt="logoAlt" @click.prevent="router.push('/welcome')">
			</div>
			<button id="loginMenu-button" @click="goLogin()">Log in</button>
		</div>
	</header>

	<header id="nav-header" v-show="authState.user">
		<div class="nav-header__content">
			<div id="nav-header__logo">
				<img id="logo" :src="logo" :alt="logoAlt" @click.prevent="router.push('/welcome')">
			</div>
			<nav id="nav-header__menu">
				<ul>
					<li><a href="#chat" @click.prevent="router.push('/chat');">Chat</a></li>
					<li><a href="#image" @click.prevent="router.push('/image');">Image</a></li>
					<li><a href="#video" @click.prevent="router.push('/video');">Video</a></li>
					<li><a href="#post" @click.prevent="router.push('/post');">Post</a></li>
				</ul>
			</nav>
			<div id="nav-header__profile">
				<img id="profile" :src="profile" :alt="profileAlt">
			</div>
			<button id="logoutMenu-button" @click="goLogout()">Log out</button>
		</div>
	</header>
</template>

<style scoped>
	#nav-header {
		display: flex;
		background-color: #2b2b2b;
		justify-content: space-around;
		align-items: center;
		border-bottom: 1px white solid; 
		padding: 0.5rem; 
	}

	#nav-header__logo, .nav-header__content, #nav-header__profile {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}

	.nav-header__content {
		gap: 2em;
	}

	#nav-header__menu > ul {
		display: flex;
		justify-content: space-around;
		align-items: center;
		gap: 1em;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	#loginMenu-button, #logoutMenu-button {
		width: 100%;
		box-sizing: border-box;
		border: none;
		padding: 0.5rem;
		border-radius: 15px;
	}
</style>