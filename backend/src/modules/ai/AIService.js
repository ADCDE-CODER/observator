export default class AIService {
    constructor(providers, whiteListOfModels = []) {
        this.providers = providers;
        this.whiteListOfModels = whiteListOfModels;
        this.providerValue = null;
    }

    // --- Provider ---

    #getProvider(providerName) {
        const provider = this.providers[providerName];

        if (!provider) {
            throw new Error(`AI provider ${providerName} is not configured`);
        }

        return provider;
    }

    getProviders() {
        try {
            return Object.keys(this.providers);
        } catch (error) {
            throw error;
        }
    }

    getProviderField() {
        try {
            const providers = this.getProviders();

            return {
                selectProvider: {
                    type: "select",
                    label: "Select a provider",
                    default: providers[0] ?? null,
                    value: this.providerValue ?? null,
                    options: providers,
                    disabled: providers.length === 0
                }
            }
        } catch (error) {
            throw error;
        }
    }

    getProviderValue() {        
        if (this.providerValue !== null) {
            return this.providerValue;
        }
        
        return this.getProviders()[0];
    }

    setProviderValue(providerValue) {
        this.providerValue = providerValue;
    }

    resetProviderValue() {
        const providerField = this.getProviderField();
        this.providerValue = providerField.selectProvider.default;
    }

    // --- Provider Config ---

    getProviderConfigField(provider) {
        const aiProvider = this.#getProvider(provider);
        return aiProvider.getProviderConfig();
    }

    getProviderConfigValues(provider) {        
        const aiProvider = this.#getProvider(provider);
        return aiProvider.getProviderConfigValues();
    }

    setProviderConfigValue(provider, values) {
        const aiProvider = this.#getProvider(provider);
        aiProvider.setProviderConfigValue(values);
    }

    resetProviderConfigValues(provider) {
        const aiProvider = this.#getProvider(provider);
        aiProvider.resetProviderConfigValues();
    }

    // --- Model ---

    async listModels(provider) {
        const aiProvider = this.#getProvider(provider);
        return await aiProvider.listModels();
    }

    async pullModel(provider, model) {
        if (this.whiteListOfModels.length !== 0 && !this.whiteListOfModels.includes(model)) {
            const error = new Error("Unsupported model");
            error.status = 400;
            throw error;
        }

        const models = await this.listModels(provider);

        if (models.includes(model)) {
            const error = new Error("This model is already installed");
            error.status = 400;
            throw error;
        }
        
        const aiProvider = this.#getProvider(provider);
        return await aiProvider.pullModel(model);
    }

    async deleteModel(provider, model) {
        const aiProvider = this.#getProvider(provider);
        return await aiProvider.deleteModel(model);
    }

    async getModelField(provider) {
        const aiProvider = this.#getProvider(provider);
        return await aiProvider.getModel();       
    }

    async getModelValue(provider) {
        const aiProvider = this.#getProvider(provider);
        return await aiProvider.getModelValue();  
    }

    async setModelValue(provider, value) {
        const aiProvider = this.#getProvider(provider);
        await aiProvider.setModelValue(value);
    }

    async resetModelValue(provider) {
        const aiProvider = this.#getProvider(provider);
        await aiProvider.resetModelValue();
    }
    
    // --- General Config ---

    getConfigField(provider) {
        const aiProvider = this.#getProvider(provider);
        return aiProvider.getConfig();    
    }

    getConfigValues(provider) {
        const aiProvider = this.#getProvider(provider);
        return aiProvider.getConfigValues();
    }

    setConfigValue(provider, values) {
        const aiProvider = this.#getProvider(provider);
        aiProvider.setConfigValue(values);
    }

    resetConfigValues(provider) {
        const aiProvider = this.#getProvider(provider);
        aiProvider.resetConfigValues();
    }

    // --- Global Reset ---

    async resetAllValues(provider) {
        this.resetProviderValue();
        const aiProvider = this.#getProvider(provider);
        await aiProvider.resetAllValues();
    }

    // --- Message Generation ---
    
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
   
        const { provider, model, config } = metadata;
   
        if (!provider|| !model) {
            const error = new Error("Provider and model are required");
            error.status = 400;
            throw error;
        }
        
        const listOfModels = await this.listModels(provider);
        const modelExist = listOfModels.some(modelValue => modelValue === model);

        if (!modelExist) {
            const error = new Error(`AI provider does not have ${model}`);
            error.status = 400;
            throw error;
        }

        // Get only role, content, and images
        chatMessages = chatMessages.map(({role, content, images}) => {
            return {role, content, images};
        });
        
        try {
            const aiProvider = this.#getProvider(provider);
            return await aiProvider.generateMessage(chatMessages, model, config);
        } catch (error) {
            throw error;
        }
    }
}