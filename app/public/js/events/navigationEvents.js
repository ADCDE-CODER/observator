import { showPage } from "../components/showPage.js";

function setupNavigationEvents() {
    // Handle browser back/forward
    window.addEventListener("popstate", (event) => {
        showPage(event.state.page, false);
    });

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
            showPage("welcome", true);
            loadChatMenu();  
        });
    } else {
        console.log(`Log out button is ${loginMenuButton}`);
    } 
};

export { setupNavigationEvents };