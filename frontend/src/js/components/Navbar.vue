<script setup>
	import ProfileIcon from '../components/ProfileIcon.vue';
	import logo from "./../../assets/images/logo.png"
	import { onMounted, onUnmounted, ref } from "vue";
	import { useRouter } from "vue-router";
	
	const router = useRouter();
	const isDropdownOpen = ref(false);
	const profileButton = ref(null);
	const dropdownMenu = ref(null);
	const { authState } = defineProps({
		authState: Object
	});
	
    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

	onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });
	
    function handleClickOutside(event) {
		if (!profileButton.value.contains(event.target) && !dropdownMenu.value.contains(event.target)) {
			isDropdownOpen.value = false;
        }
    }

	function toggleDropdown() {
		isDropdownOpen.value = !isDropdownOpen.value;
	}
	
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
				<!-- Profile Button-->
				<button class="profile-button" @click="toggleDropdown()" ref="profileButton">
					<ProfileIcon color="var(--color-on-surface)" width="25" height="25" aria-label="profile image"/>
				</button>

				<!-- The Dropdown Menu Panel -->
				<div class="dropdown-menu" v-show="isDropdownOpen" ref="dropdownMenu">
					<RouterLink class="dropdown-item" to="/welcome">Profile 🚧</RouterLink>
					<RouterLink class="dropdown-item" to="/welcome">Settings 🚧</RouterLink>
					<div class="divider"></div>
					<button class="dropdown-item secondary-button" @click="goLogout()">Log out</button>
				</div>
			</div>
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
	
	.navbar-logo {
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

	.navbar-profile {
		display: inline-block;
		cursor: pointer;
		position: relative;
	}

	.profile-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0px;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.dropdown-menu {
		background-color: var(--color-surface-container-high);
		border: 1px solid var(--color-outline);
		position: absolute;
		margin-top: 5px;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 15px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.dropdown-item {
		color: var(--color-on-surface);
		text-decoration: none;
		box-sizing: border-box;
		padding: 10px 20px;
		border-radius: 15px;
		cursor: pointer;
		text-align: center;
		transition: background-color 1s, color 1s;
	}

	.divider {
		height: 1px;
		background-color: var(--color-outline);
	}

	.nav-link:hover, .dropdown-item:hover, .router-link-exact-active {
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