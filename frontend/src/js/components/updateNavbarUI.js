import { loadFromLocalStorage } from "../utils/localStorage.js";

function updateNavbarUI() {  
    const user = loadFromLocalStorage("user");

    const navHeaderMenu = document.getElementById("nav-header__menu");
    const navHeaderProfile = document.getElementById("nav-header__profile");
    const loginMenuButton = document.getElementById("loginMenu-button");
    const logoutMenuButton = document.getElementById("logoutMenu-button");

    if (!user) {
        navHeaderMenu.style.display = "none";
        navHeaderProfile.style.display = "none";
        loginMenuButton.style.display = "flex";
        logoutMenuButton.style.display = "none";
    } else {
        navHeaderMenu.style.display = "flex";
        navHeaderProfile.style.display = "flex";
        loginMenuButton.style.display = "none";
        logoutMenuButton.style.display = "flex";
    }
    
    console.log({...localStorage});
};

export { updateNavbarUI };