export default class ChatMetadataService {
    constructor(chatMetadataModel, aiService) {
        this.chatMetadataModel = chatMetadataModel;
        this.aiService = aiService;
    }

    async getChatMetadataField(provider) {
        const providerField = this.aiService.getProviderField();
        const providerConfigField = this.aiService.getProviderConfigField(provider);
        const modelField = await this.aiService.getModelField(provider);
        const configField = this.aiService.getConfigField(provider);

        return {
            provider: providerField,
            providerConfig: providerConfigField,
            model: modelField,
            config: configField
        };
    }

    async getChatMetadataValue(provider) {
        return {
            providerConfigValue: JSON.stringify(this.aiService.getProviderConfigValues(provider)),
            modelValue: await this.aiService.getModelValue(provider),
            configValue: JSON.stringify(await this.aiService.getConfigValues(provider))
        };
    }

    async setChatMetadataValue(provider, providerConfig, model, config) {
        this.aiService.setProviderValue(provider);
        this.aiService.setProviderConfigValue(provider, providerConfig);
        await this.aiService.setModelValue(provider, model);
        this.aiService.setConfigValue(provider, config);
    }

    async create(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required to create a chat metadata.");
        }

        // Get default values
        const providerValue = this.aiService.getProviderValue();
        const { providerConfigValue, modelValue, configValue } = await this.getChatMetadataValue(providerValue);

        try {
            // Store default values
            this.chatMetadataModel.create(providerValue, providerConfigValue, modelValue, configValue, chatId);
        } catch (error) {
            throw error;
        }
    }
    
    fetchChatMetadata(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required to get a chat metadata.");
        }
        
        const chatMetadata = this.chatMetadataModel.findById(chatId);

        if (!chatMetadata) {
            throw new Error("Chat metadata not found.");
        }
        
        return {
            ...chatMetadata,
            providerConfig: JSON.parse(chatMetadata.provider_config),
            config: JSON.parse(chatMetadata.config)
        };
    }
    
    async getChatMetadata(chatId) {
        const { provider, providerConfig, model, config } = this.fetchChatMetadata(chatId);
        
        // Update each field value
        await this.setChatMetadataValue(provider, providerConfig, model, config);

        // Get each field value
        return await this.getChatMetadataField(provider);
    }

    async updateProvider(provider, chatId) {
        if (provider.section !== "provider") {
            throw new Error("The section is not a provider");
        }
        
        if (!chatId) {
            throw new Error("Chat ID is required to update a provider metadata.");
        }
        
        const selectProvider = provider.value.selectProvider;
        const { providerConfigValue, modelValue, configValue } = await this.getChatMetadataValue(selectProvider);
        
        // When updated provider value, then provider config, model and config need also update. 
        // Because each provider have diffrent provider config, list of models and config.
        await this.setChatMetadataValue(selectProvider, providerConfigValue, modelValue, configValue);
        
        const metadata = this.chatMetadataModel.update(selectProvider, providerConfigValue, modelValue, configValue, chatId)

        if(!metadata) {
            throw new Error("Update failed.");
        }

        // Once a specific provider has been selected, a specific provider config, list of models and config is retrieved.
        return await this.getChatMetadataField(selectProvider);
    }

    async updateModel(model, chatId, onChunk) {  
        if (model.section !== "model") {
            throw new Error("The section is not a model");
        }

        if (!chatId) {
            throw new Error("Chat ID is required to update a model metadata.");
        }

        const { pullModel, selectModel, deleteModel } = model.value;
        const providerValue = this.aiService.getProviderValue();

        if (pullModel && deleteModel) {
            throw new Error("It is not possible to pull and delete the model at the same time.");
        }

        if (pullModel) {
            const stream = await this.aiService.pullModel(providerValue, pullModel);
    
            for await (const progress of stream) {
                onChunk(progress);
            }
        }

        if (deleteModel) {
            await this.aiService.deleteModel(providerValue, deleteModel);
        }

        this.aiService.setModelValue(providerValue, selectModel);

        const metadata = this.chatMetadataModel.updateModel(selectModel, chatId);

        if(!metadata) {
            throw new Error("Update failed.");
        }

        const modelField = await this.aiService.getModelField(providerValue);

        return { model: modelField };
    }

    updateConfig(config, chatId) {
        if (config.section !== "config") {
            throw new Error("The section is not a config");
        }

        if (!chatId) {
            throw new Error("Chat ID is required to update a config metadata.");
        }

        const providerValue = this.aiService.getProviderValue();
        this.aiService.setConfigValue(providerValue, config.value);
        config.value = JSON.stringify(config.value);

        const metadata = this.chatMetadataModel.updateConfig(config.value, chatId);

        if(!metadata) {
            throw new Error("Update failed.");
        }

        const configField = this.aiService.getConfigField(providerValue);

        return { config: configField };
    }

    async resetProvider() {
        this.aiService.resetProviderValue();
        const providerValue = this.aiService.getProviderValue();
        const metadataField = await this.getChatMetadataField(providerValue);

        return {
            section: "provider",
            ...metadataField
        };
    }

    async resetModel() {
        const providerValue = this.aiService.getProviderValue();
        await this.aiService.resetModelValue(providerValue);
        const modelField = await this.aiService.getModelField(providerValue);

        return { 
            section: "model",
            model: modelField 
        };
    }

    resetConfig() {
        const providerValue = this.aiService.getProviderValue();
        this.aiService.resetConfigValues(providerValue);
        const configField = this.aiService.getConfigField(providerValue);

        return { 
            section: "config",
            config: configField 
        };
    }
}