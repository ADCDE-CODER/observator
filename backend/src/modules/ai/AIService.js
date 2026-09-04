export default class AIService {
    constructor(providers, whiteListOfModels = []) {
        this.providers = providers;
        this.whiteListOfModels = whiteListOfModels;
    }

    #getProvider(providerName) {
        const provider = this.providers[providerName];

        if (!provider) {
            throw new Error(`AI provider ${providerName} is not configured`);
        }

        return provider;
    }

    getProviders() {
        return this.providers;
    }

    async getModels(provider) {
        try {
            const aiProvider = this.#getProvider(provider);
            return await aiProvider.getModels();
        } catch (error) {
            throw error;
        }
    }

    async pullModel(model) {
        if (this.whiteListOfModels.length !== 0 && !this.whiteListOfModels.includes(model)) {
            const error = new Error("Unsupported model");
            error.status = 400;
            throw error;
        }
        
        try {
            const aiProvider = this.#getProvider(provider);
            return await aiProvider.pullModel(model);
        } catch (error) {
            throw error;
        }
    }
    
    async generateMessage(chatMessages, metadata) {
        if (!chatMessages) {
            const error = new Error("Chat messages are required");
            error.status = 400;
            throw error;
        }

        if (chatMessages.length !== 0) {
            const lastIndex = chatMessages.length - 1;

            if (!chatMessages[lastIndex].content) {
                const error = new Error("Content is required");
                error.status = 400;
                throw error;
            }
        }
   
        if (!metadata.provider || !metadata.model) {
            const error = new Error("Provider and model are required");
            error.status = 400;
            throw error;
        }

        // Get only role, content, and images
        chatMessages = chatMessages.map(({role, content, images}) => {
            return {role, content, images};
        });
        
        const listOfModels = await this.getModels(metadata.provider);
        const modelExist = listOfModels.some(model => model.name === metadata.model);

        if (!modelExist) {
            const error = new Error(`AI provider does not have ${metadata.model}`);
            error.status = 400;
            throw error;
        }
        
        try {
            const aiProvider = this.#getProvider(metadata.provider);
            return await aiProvider.generateMessage(chatMessages, metadata);
        } catch (error) {
            throw error;
        }
    }
}