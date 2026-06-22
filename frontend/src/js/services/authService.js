import { signupUser, signinUser } from "../api/authApi.js";

async function createAccount(email, password) {
    const result = await signupUser(email, password);

    if (result.ok && result.success) {
        alert(result.message);
        return result;
    } else {
        alert(`${result.error} (status: ${result.status})`);
    }
};

async function readAccount(email, password) {
    const result = await signinUser(email, password);

    if (result.ok && result.success) {        
        alert(result.message);
        return result;
    } else {
        alert(`${result.error} (status: ${result.status})`);
    }
};

export { createAccount, readAccount };