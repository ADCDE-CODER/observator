import BaseAPI from "../BaseApi.js";

export default class UserAPI extends BaseAPI {
    constructor() {
        super("/api/users", { token: null });
    }

    async signup(user) {
        return await this.request("/signup", { method: "POST", body: user });
    }

    async signin(user) { 
        return await this.request("/signin", { method: "POST", body: user });
    }
}