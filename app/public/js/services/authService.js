import { signupUser } from "../api/signup.js";
import { signinUser } from "../api/signin.js";
import { saveToLocalStorage } from "../utils/localStorage.js";
import { showPage } from "../components/showPage.js";
import { loadChatMenu } from "../services/chatService.js";

async function createAccount() {
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
};

async function readAccount() {
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
};

export { createAccount, readAccount };