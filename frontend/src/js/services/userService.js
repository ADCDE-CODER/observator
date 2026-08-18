import { createUser, readUser } from "../api/userApi.js";

async function createAccount(user) {
    if (typeof user.email === 'string') {
        user.email = user.email.trim();
    }

    if (typeof user.username === 'string') {
        user.username = user.username.trim();
    }

    if (typeof user.password === 'string') { 
        user.password = user.password.trim();
    }

    return await createUser(user);
};

async function readAccount(user) {
    if (typeof user.email === 'string') {
        user.email = user.email.trim();
    }

    if (typeof user.username === 'string') {
        user.username = user.username.trim();
    }

    if (typeof user.password === 'string') { 
        user.password = user.password.trim();
    }

    return await readUser(user);
};

export { createAccount, readAccount };