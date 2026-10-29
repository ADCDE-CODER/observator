import UserAPI from "./UserApi.js";

export default class UserService {
    constructor({ token } = {}) {
        this.token = token;
        this.userApi = new UserAPI(token);
    }

    async signup(user) {
        if (typeof user.email === 'string') {
            user.email = user.email.trim();
        }

        if (typeof user.username === 'string') {
            user.username = user.username.trim();
        }

        if (typeof user.password === 'string') { 
            user.password = user.password.trim();
        }

        return await this.userApi.signup(user);
    }

    async signin(user) {
        if (typeof user.email === 'string') {
            user.email = user.email.trim();
        }

        if (typeof user.username === 'string') {
            user.username = user.username.trim();
        }

        if (typeof user.password === 'string') { 
            user.password = user.password.trim();
        }

        return await this.userApi.signin(user);
    }

    async deleteAccount() { 
        if (!this.token) {
            throw new Error("Token missing.");
        }

        return await this.userApi.deleteAccount();
    }
}