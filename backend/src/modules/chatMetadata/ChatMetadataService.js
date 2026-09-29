export default class ChatMetadataService {
    constructor(chatMetadataModel, aiService) {
        this.chatMetadataModel = chatMetadataModel;
        this.aiService = aiService;
    }

    async create(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required to create a chat metadata.");
        }

        // Get default values
        const providerValue = this.aiService.getProviderValue();
        const modelValue = await this.aiService.getModelValue(providerValue);
        const configValue = JSON.stringify(this.aiService.getConfigValues(providerValue));

        try {
            // Store default values
            this.chatMetadataModel.create(providerValue, modelValue, configValue, chatId);
        } catch (error) {
            throw error;
        }
    }

    fetchChatMetadata(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required to get a chat metadata.");
        }

        try {            
            const chatMetadata = this.chatMetadataModel.findById(chatId);

            if (!chatMetadata) {
                throw new Error("Chat metadata not found.");
            }
            
            chatMetadata.config = JSON.parse(chatMetadata.config)

            const { provider, model, config } = chatMetadata;

            return {
                provider: provider,
                model: model,
                config: config
            };
        } catch (error) {
            throw error;
        }
    }
    
    async getChatSettings(chatId) {
        try {            
            const { provider, model, config } = this.fetchChatMetadata(chatId);
            
            // Update each field value
            this.aiService.setProviderValue(provider);
            this.aiService.setModelValue(provider, model);
            this.aiService.setConfigValue(provider, config);

            const providerField = this.aiService.getProviderField();
            const modelField = await this.aiService.getModelField(provider);
            const configField = this.aiService.getConfigField(provider);

            return {
                provider: providerField,
                model: modelField,
                config: configField
            };
        } catch (error) {
            throw error;
        }
    }
    
    async update(chatMetadata, chatId, onChunk) {
        const { section, value } = chatMetadata;
        
        if (!chatId) {
            throw new Error("Chat ID is required to update a chat metadata.");
        }

        try {
            if (section === "provider") {
                return await this.updateProvider(value, chatId);
            }

            if (section === "model") {
                return await this.updateModel(value, chatId, onChunk);
            }

            if (section === "config") {
                return await this.updateConfig(value, chatId);
            }

            throw new Error("Unknown settings section.");
        } catch (error) {
            throw error;
        }
    }

    async updateProvider(value, chatId) {
        this.aiService.setProviderValue(value);

        const providerValue = this.aiService.getProviderValue();
        const modelValue = await this.aiService.getModelValue(providerValue);
        const configValue = JSON.stringify(await this.aiService.getConfigValues(providerValue));

        // When updated provider value, then model and config need also update. 
        // Because each provider have diffrent list of models and config.
        this.aiService.setModelValue(providerValue, modelValue);
        this.aiService.setConfigValue(providerValue, configValue);
        
        try {
            const metadata = this.chatMetadataModel.update(providerValue, modelValue, configValue, chatId)

            if(!metadata) {
                throw new Error("Update failed.");
            }

            // Once a specific provider has been selected, a specific list of models and config is retrieved.
            const providerField = this.aiService.getProviderField();
            const modelField = await this.aiService.getModelField(value);
            const configField = this.aiService.getConfigField(value);

            return {
                provider: providerField,
                model: modelField,
                config: configField
            };
        } catch (error) {
            throw error;
        }
    }

    async updateModel(value, chatId, onChunk) {        
        const { pullModel, selectModel, deleteModel } = value;
        const providerValue = this.aiService.getProviderValue();

        if (pullModel.value && deleteModel.value) {
            throw new Error("It is not possible to pull and delete the model at the same time.");
        }

        if (pullModel.value) {
            const stream = await this.aiService.pullModel(providerValue, pullModel.value);
    
            for await (const progress of stream) {
                onChunk(progress);
            }
        }

        if (deleteModel.value) {
            await this.aiService.deleteModel(providerValue, deleteModel.value);
        }

        this.aiService.setModelValue(providerValue, selectModel.value);
        const modelValue = await this.aiService.getModelValue(providerValue);

        try {
            const metadata = this.chatMetadataModel.updateModel(modelValue, chatId);

            if(!metadata) {
                throw new Error("Update failed.");
            }

            const providerField = this.aiService.getProviderField();
            const modelField = await this.aiService.getModelField(providerValue);
            const configField = this.aiService.getConfigField(providerValue);

            return {
                provider: providerField,
                model: modelField,
                config: configField
            };
        } catch (error) {
            throw error;
        }
    }

    async updateConfig(value, chatId) {
        const providerValue = this.aiService.getProviderValue();
        
        this.aiService.setConfigValue(providerValue, value);
        const configValue = JSON.stringify(await this.aiService.getConfigValues(providerValue));

        try {
            const metadata = this.chatMetadataModel.updateConfig(configValue, chatId);

            if(!metadata) {
                throw new Error("Update failed.");
            }

            const providerField = this.aiService.getProviderField();
            const modelField = await this.aiService.getModelField(providerValue);
            const configField = this.aiService.getConfigField(providerValue);

            return {
                provider: providerField,
                model: modelField,
                config: configField
            };
        } catch (error) {
            throw error;
        }
    }

    async resetProvider() {
        this.aiService.resetProviderValue();

        const providerValue = this.aiService.getProviderValue();

        const providerField = this.aiService.getProviderField();
        const modelField = await this.aiService.getModelField(providerValue);
        const configField = this.aiService.getConfigField(providerValue);

        return {
            provider: providerField,
            model: modelField,
            config: configField
        };
    }

    async resetModel() {
        const providerValue = this.aiService.getProviderValue();
        await this.aiService.resetModelValue(providerValue);
        const modelField = await this.aiService.getModelField(providerValue);

        return modelField;
    }

    async resetConfig() {
        const providerValue = this.aiService.getProviderValue();
        this.aiService.resetConfigValues(providerValue);
        const configField = this.aiService.getConfigField(providerValue);

        return configField;
    }
}