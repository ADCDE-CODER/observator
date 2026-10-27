import ChatMetadataAPI from "./ChatMetadataApi";

export default class ChatMetadataService {
    constructor(token) {
        if (!token) {
            throw new Error("Token missing.");
        }

        this.chatMetadataApi = new ChatMetadataAPI(token);
    }

    async getMetadata(chatId) {
        if (!chatId) {
            throw new Error("Chat ID missing.");
        }

        return await this.chatMetadataApi.getMetadata(chatId);
    }

    async updateProvider(chatId, provider) {
        if (!chatId) {
            throw new Error("Chat ID missing.");
        }
        
        if (!provider.value.selectProvider) {
            throw new Error("Provider input value missing.")
        }

        return await this.chatMetadataApi.updateProvider(chatId, provider);
    }

    async updateProviderConfig(chatId, providerConfig) {
        if (!chatId) {
            throw new Error("Chat ID missing.");
        }

        return await this.chatMetadataApi.updateProviderConfig(chatId, providerConfig);
    }

    async updateModel(chatId, model, onChunk) {
        if (!chatId) {
            throw new Error("Chat ID missing.");
        }

        if (!onChunk) {
            throw new Error("Callback missing.");
        }

        await this.chatMetadataApi.updateModel(chatId, model, onChunk);
    }

    async updateConfig(chatId, config) {
        if (!chatId) {
            throw new Error("Chat ID missing.");
        }

        for (const key in config.value) {
            const value = config.value[key];

            if (value === null || value === undefined) {
                throw new Error(`${key} input value missing.`)
            }
        }

        return await this.chatMetadataApi.updateConfig(chatId, config);
    }

    async reset(chatId, endpoint) {
        if (!chatId) {
            throw new Error("Chat ID missing.");
        }

        if (!endpoint) {
            throw new Error("Endpoint missing.")
        }

        return await this.chatMetadataApi.reset(chatId, endpoint);
    }
}