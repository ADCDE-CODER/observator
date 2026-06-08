import { createAccount, readAccount } from "../services/authService.js";

function setupAuthEvents() {
    const signUpButton = document.getElementById("signup-button");
    const signInButton = document.getElementById("signin-button");

    if (signUpButton) {
        signUpButton.addEventListener("click", async () => {
            createAccount();
        });
    } else {
        console.log(`Sign up button is ${signUpButton}`);
    }

    if (signInButton) {
        signInButton.addEventListener("click", async () => {
            readAccount();
        });
    } else {
        console.log(`Sign out button is ${signInButton}`);
    }
};

export { setupAuthEvents };