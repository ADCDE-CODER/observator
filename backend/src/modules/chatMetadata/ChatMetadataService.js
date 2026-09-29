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
    
    async getChatMetadata(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required to get a chat metadata.");
        }
        
        const chatMetadata = this.chatMetadataModel.findById(chatId);

        if (!chatMetadata) {
            throw new Error("Chat metadata not found.");
        }
        
        chatMetadata.config = JSON.parse(chatMetadata.config);

        const { provider, model, config } = chatMetadata;
        
        // Update each field value
        this.aiService.setProviderValue(provider);
        this.aiService.setModelValue(provider, model);
        this.aiService.setConfigValue(provider, config);

        // Get each field value
        const providerField = this.aiService.getProviderField();
        const modelField = await this.aiService.getModelField(provider);
        const configField = this.aiService.getConfigField(provider);

        return {
            provider: providerField,
            model: modelField,
            config: configField
        };
    }

    async updateProvider(provider, chatId) {
        if (provider.section !== "provider") {
            throw new Error("The section is not a provider");
        }
        
        if (!chatId) {
            throw new Error("Chat ID is required to update a provider metadata.");
        }
        
        const modelValue = await this.aiService.getModelValue(provider.value);
        const configValue = JSON.stringify(await this.aiService.getConfigValues(provider.value));
        
        // When updated provider value, then model and config need also update. 
        // Because each provider have diffrent list of models and config.
        this.aiService.setProviderValue(provider.value);
        this.aiService.setModelValue(provider.value, modelValue);
        this.aiService.setConfigValue(provider.value, configValue);
        
        const metadata = this.chatMetadataModel.update(provider.value, modelValue, configValue, chatId)

        if(!metadata) {
            throw new Error("Update failed.");
        }

        // Once a specific provider has been selected, a specific list of models and config is retrieved.
        const providerField = this.aiService.getProviderField();
        const modelField = await this.aiService.getModelField(provider.value);
        const configField = this.aiService.getConfigField(provider.value);

        return {
            provider: providerField,
            model: modelField,
            config: configField
        };
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

            const modelField = await this.aiService.getModelField(providerValue);

            return modelField;
        } catch (error) {
            throw error;
        }
    }

    async updateConfig(config, chatId) {
        if (model.section !== "config") {
            throw new Error("The section is not a config");
        }

        if (!chatId) {
            throw new Error("Chat ID is required to update a config metadata.");
        }

        const providerValue = this.aiService.getProviderValue();
        
        this.aiService.setConfigValue(providerValue, config);
        const configValue = JSON.stringify(await this.aiService.getConfigValues(providerValue));

        try {
            const metadata = this.chatMetadataModel.updateConfig(configValue, chatId);

            if(!metadata) {
                throw new Error("Update failed.");
            }

            const configField = this.aiService.getConfigField(providerValue);

            return configField;
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