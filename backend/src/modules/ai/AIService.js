export default class AIService {
    constructor(providers, whiteListOfModels = []) {
        this.providers = providers;
        this.whiteListOfModels = whiteListOfModels;
        this.providerValue = null;
        this.providerConfig = {};
        this.model = {};
        this.config = {};
    }

    // ### PROVIDER ###

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

    // ### PROVIDER CONFIG ###

    updateProviderConfig(provider, config) {
        const aiProvider = this.#getProvider(provider);
        aiProvider.configure(config);
    }

    getProviderConfigField(provider) {
        if (!this.providerConfig[provider]) {
            const aiProvider = this.#getProvider(provider);
            this.providerConfig[provider] = aiProvider.getProviderConfig();
        }

        return this.providerConfig[provider];
    }

    getProviderConfigValues(provider) {        
        const providerConfigField = this.getProviderConfigField(provider);

        return Object.fromEntries(
            Object.entries(providerConfigField).map(([key, field]) => [
                key, field.value
            ])
        );
    }

    setProviderConfigValue(provider, values) {
        const providerConfigField = this.getProviderConfigField(provider);

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && providerConfigField[key]) {
                providerConfigField[key].value = value;
            }
        });
    }

    resetProviderConfigValues(provider) {
        const providerConfigField = this.getProviderConfigField(provider);

        Object.entries(providerConfigField).forEach(([key]) => {
            providerConfigField[key].value = providerConfigField[key].default;
        });
    }

    // ### MODEL ###

    async listModels(provider) {
        try {
            const aiProvider = this.#getProvider(provider);
            return await aiProvider.listModels();
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

        const models = await this.listModels(provider);

        if (models.includes(model)) {
            const error = new Error("This model is already installed");
            error.status = 400;
            throw error;
        }
        
        try {
            // Set the model to null, to get a new model field when calling getModelField()
            this.model[provider] = null;
            const aiProvider = this.#getProvider(provider);
            return await aiProvider.pullModel(model);
        } catch (error) {
            throw error;
        }
    }

    async deleteModel(provider, model) {
        try {
            // Set the model to null, to get a new model field when calling getModelField()
            this.model[provider] = null;
            const aiProvider = this.#getProvider(provider);
            return await aiProvider.deleteModel(model);
        } catch (error) {
            throw error;
        }
    }

    async getModelField(provider) {
        try {
            if (!this.model[provider]) {
                const aiProvider = this.#getProvider(provider);
                this.model[provider] = await aiProvider.getModel();
            }

            return this.model[provider];
        } catch (error) {
            throw error;
        }        
    }

    async getModelValue(provider) {
        const modelField = await this.getModelField(provider);
        return modelField.selectModel.value;
    }

    async setModelValue(provider, value) {
        const modelField = await this.getModelField(provider);
        modelField.selectModel.value = value;
    }

    async resetModelValue(provider) {
        const modelField = await this.getModelField(provider);
        modelField.selectModel.value = modelField.selectModel.default;
    }
    
    // ### CONFIG ###

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
        const configField = this.getConfigField(provider);

        return Object.fromEntries(
            Object.entries(configField).map(([key, field]) => [
                key, field.value
            ])
        );
    }

    setConfigValue(provider, values) {
        const configField = this.getConfigField(provider);

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && configField[key]) {
                configField[key].value = value;
            }
        });
    }

    resetConfigValues(provider) {
        const configField = this.getConfigField(provider);

        Object.entries(configField).forEach(([key]) => {
            configField[key].value = configField[key].default;
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