import BaseAPI from "../BaseApi.js";

export default class ChatMetadataAPI extends BaseAPI {
    constructor(token) {
        super("/api/chats", { token });
    }

    async getMetadata(chatId) {
        return await this.request(`/${chatId}/chatMetadata`, { method: "GET" });
    }

    async updateProvider(chatId, provider) {
        return await this.request(`/${chatId}/chatMetadata/provider`, { method: "PUT", body: provider });
    }

    async updateProviderConfig(chatId, providerConfig) {
        return await this.request(`/${chatId}/chatMetadata/providerconfig`, { method: "PUT", body: providerConfig });
    }

    async updateModel(chatId, model, onChunk) {
        const url = `${this.baseUrl}/${chatId}/chatMetadata/model`;

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify(model),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        if (!reader) {
            throw new Error("Response body is not a stream");
        }

        let eventType = null;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            if (value) {
                // Decode the binary chunk
                const text = decoder.decode(value);
                const lines = text.split("\n");

                for (const line of lines) {
                    // Get the event type
                    if (line.startsWith("event: ")) {
                        eventType = line.replace("event: ", "").trim();
                    }

                    // Get the data
                    if (line.startsWith("data: ")) {
                        const data = line.replace("data: ", "").trim();
                        const parsed = JSON.parse(data);

                        onChunk(eventType, parsed);
                        eventType = null; // reset after each event
                    }
                }
            }
        }
    }

    async updateConfig(chatId, config) {
        return await this.request(`/${chatId}/chatMetadata/config`, { method: "PUT", body: config });
    }

    async reset(chatId, endpoint) {
        return await this.request(`/${chatId}/chatMetadata/${endpoint}`, { method: "GET" });
    }
}