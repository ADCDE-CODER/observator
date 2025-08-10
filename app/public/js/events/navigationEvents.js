import { clearLocalStorage } from "../utils/localStorage.js";
import { initUserSession } from "../services/userService.js";
import { showPage } from "../components/showPage.js";

function setupNavigationEvents() {
    // Handle browser back/forward
    window.addEventListener("popstate", (event) => {
        showPage(event.state.page, false);
    });

    // Handle navigation links
    const navLinks = document.querySelectorAll("#nav-header__menu a");
    if (navLinks) {
        for (let i = 0; i < navLinks.length; i++) {
            const navLink = navLinks[i];
            navLink.addEventListener("click", (event) => {
                event.preventDefault();
                const pageID = navLink.getAttribute("href").substring(1);
                showPage(pageID, true);
            })
        }
    } else {
        console.log(`Navigation links are ${navLinks}`);
    }

    // Handle logo click
    const logoButton = document.getElementById("nav-header__logo");
    if (logoButton) {
        logoButton.addEventListener("click", () => {
            showPage("welcome", true);
        });
    } else {
        console.log(`Logo button is ${logoButton}`);
    }

    // Handle log in click
    const loginMenuButton = document.getElementById("loginMenu-button");
    if (loginMenuButton) {
        loginMenuButton.addEventListener("click", () => {
            showPage("sign-menu", true);
        }); 
    } else {
        console.log(`Log in button is ${loginMenuButton}`);
    }

    // Handle log out click
    const logoutMenuButton = document.getElementById("logoutMenu-button");
    if (logoutMenuButton) {
        logoutMenuButton.addEventListener("click", () => {
            clearLocalStorage();
            initUserSession(); 
        });
    } else {
        console.log(`Log out button is ${loginMenuButton}`);
    } 
};

export { setupNavigationEvents };