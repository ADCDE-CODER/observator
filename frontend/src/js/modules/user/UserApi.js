import BaseAPI from "../BaseApi.js";

export default class UserAPI extends BaseAPI {
    constructor(token) {
        super("/api/users", { token: token });
    }

    async signup(user) {
        return await this.request("/signup", { method: "POST", body: user });
    }

    async signin(user) { 
        return await this.request("/signin", { method: "POST", body: user });
    }

    async deleteAccount() { 
        return await this.request("/", { method: "DELETE" });
    }
}