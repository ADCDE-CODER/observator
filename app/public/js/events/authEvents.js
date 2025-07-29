import { signupUser } from "../api/signup.js";
import { signinUser } from "../api/signin.js";
import { saveToLocalStorage } from "../utils/localStorage.js";
import { showPage } from "../components/showPage.js";
import { loadChatMenu } from "../services/chatService.js";

function setupAuthEvents() {
    const signUpButton = document.getElementById("signup-button");
    const signInButton = document.getElementById("signin-button");

    if (signUpButton) {
        signUpButton.addEventListener("click", async () => {
            const emailInput = document.getElementById("create-email");
            const passwordInput = document.getElementById("create-password");

            const email = emailInput.value;
            const password = passwordInput.value;

            const result = await signupUser(email, password);

            if (result.ok && result.success) {
                emailInput.value = "";
                passwordInput.value = "";

                alert(result.message);
            } else {
                alert(`${result.error} (status: ${result.status})`);
            }
        });
    } else {
        console.log(`Sign up button is ${signUpButton}`);
    }

    if (signInButton) {
        signInButton.addEventListener("click", async () => {
            const emailInput = document.getElementById("read-email");
            const passwordInput = document.getElementById("read-password");

            const email = emailInput.value;
            const password = passwordInput.value;

            const result = await signinUser(email, password);

            if (result.ok && result.success) {
                emailInput.value = "";
                passwordInput.value = "";

                saveToLocalStorage("token", result.token);
                saveToLocalStorage("user", result.user);

                showPage("chat", true);
                loadChatMenu();  
                alert(result.message);
            } else {
                alert(`${result.error} (status: ${result.status})`);
            } 
        });
    } else {
        console.log(`Sign out button is ${signInButton}`);
    }
};

export { setupAuthEvents };