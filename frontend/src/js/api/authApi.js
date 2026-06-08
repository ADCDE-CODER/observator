import { requestApi } from "./requestApi.js";

async function signupUser(email, password) {
    const data = {
        email: email, 
        password: password
    };

    return requestApi("http://localhost:3000/user/signup", "POST", null, data, "Sign up error:");
};

async function signinUser(email, password) {
    const data = {
        email: email, 
        password: password
    };

    return requestApi("http://localhost:3000/user/signin", "POST", null, data, "Sign in error:");
};

export { signupUser, signinUser };