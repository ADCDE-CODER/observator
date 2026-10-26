import BaseAPI from "../BaseApi.js";

export default class ChatAPI extends BaseAPI {
    constructor(token) {
        super("/api/chats", { token });
    }

    async create(title) {
        return await this.request("", { method: "POST", body: { title } }); 
    }

    async getAll() {
        return await this.request("", { method: "GET" });
    }

    async update(id, title) {
        return await this.request(`/${id}`, { method: "PUT", body: { title } }); 
    }

    async remove(id) {
        return await this.request(`/${id}`, { method: "DELETE" }); 
    }
}