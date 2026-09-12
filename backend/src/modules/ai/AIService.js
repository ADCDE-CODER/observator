export default class AIService {
    constructor(providers, whiteListOfModels = []) {
        this.providers = providers;
        this.whiteListOfModels = whiteListOfModels;
        this.providerValue = null;
        this.modelValue = {};
        this.config = {};
    }

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

    async getModels(provider) {
        try {
            const aiProvider = this.#getProvider(provider);
            return await aiProvider.getModels();
        } catch (error) {
            throw error;
        }
    }

    async pullModel(provider, model) {
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

    getProviderField() {
        try {
            const providers = this.getProviders();
            const defaultProvider = providers[0];
            
            return {
                type: "select",
                label: "Provider",
                default: defaultProvider,
                value: this.providerValue ?? defaultProvider,
                options: providers
            };
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

    setProviderValue(value) {
        this.providerValue = value;
    }

    async getModelField(provider) {
        try {
            const models = await this.getModels(provider);
            
            if (!this.modelValue[provider]) {
                const defaultModel = models[0];
                this.modelValue[provider] = defaultModel;
            }

            return {
                type: "select",
                label: "Model",
                default: models[0],
                value: this.modelValue[provider],
                options: models
            };
        } catch (error) {
            throw error;
        }        
    }

    async getModelValue(provider) {
        const model = await this.getModelField(provider);
        return model.value;
    }

    setModelValue(provider, value) {
        this.modelValue[provider] = value;
    }
    
    getConfigField(provider) {
        try {
            if (!this.config[provider]) {
                const aiProvider = this.#getProvider(provider);
                this.config[provider] = aiProvider.getConfig();
            }
            
            return this.config[provider];
        } catch (error) {
            throw error;
        }
    }

    getConfigValues(provider) {
        const config = this.getConfigField(provider);


        return Object.fromEntries(
            Object.entries(config).map(([key, field]) => [
                key, field.value
            ])
        );
    }

    setConfigValue(provider, values) {
        const config = this.getConfigField(provider);

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && config[key]) {
                config[key].value = value;
            }
        });
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