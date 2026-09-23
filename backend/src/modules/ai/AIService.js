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

    getProviderField() {
        try {
            const providers = this.getProviders();
            
            return {
                type: "select",
                label: "Provider",
                default: providers[0] ?? null,
                value: this.providerValue ?? null,
                options: providers,
                disabled: providers.length === 0
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

    async deleteModel(provider, model) {
        try {
            const aiProvider = this.#getProvider(provider);
            return await aiProvider.deleteModel(model);
        } catch (error) {
            throw error;
        }
    }

    async getModelField(provider) {
        try {
            const models = await this.getModels(provider);
            
            if (!this.modelValue[provider] && models.length > 0) {
                this.modelValue[provider] = models[0];
            }

            return {
                pullModel: {
                    type: "text",
                    label: "Pull a model",
                    placeholder: "Type a model name",
                    value: null
                },

                selectModel: {
                    type: "select",
                    label: "Select a model",
                    default: models[0] ?? null,
                    value: this.modelValue[provider] ?? null,
                    options: models,
                    disabled: models.length === 0
                },

                deleteModel: {
                    type: "select",
                    label: "Delete a model",
                    default: null,
                    value: null,
                    options: models,
                    disabled: models.length === 0
                },
            };
        } catch (error) {
            throw error;
        }        
    }

    async getModelValue(provider) {
        const modelField = await this.getModelField(provider);
        return modelField.selectModel.value;
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
   
        const { provider, model, config } = metadata;
   
        if (!provider|| !model) {
            const error = new Error("Provider and model are required");
            error.status = 400;
            throw error;
        }
        
        const listOfModels = await this.getModels(provider);
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