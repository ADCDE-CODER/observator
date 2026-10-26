export default class BaseAPI {
    constructor(baseUrl, { token = null } = {}) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    async request(path = "", { method = "GET", body } = {}) {
        const url = `${this.baseUrl}${path}`;

        const headers = { "Content-Type": "application/json" };
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`; 
        }

        const response = await fetch(url, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message ?? "Request failed");
        }

        return result;
    }
}