import { Ollama } from "ollama";
import { env } from "../../../config/env.js";

export default class OllamaProvider {
    constructor(config = {}) {
        this.defaultConfig = config;
        this.#configure(config);
        this.providerConfig = {};
        this.model = {};
        this.config = {};
    }

    // ### PROVIDER CONFIG ####

    #configure(config = {}) {
        this.host = config.host?.trim();
        this.apiKey = config.apiKey?.trim();

        this.localClient = null;
        this.cloudClient = null;

        if(this.host) {
            this.localClient = new Ollama({
                host: this.host 
            });
        }
        
        if (this.apiKey) {
            this.cloudClient = new Ollama({
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                },
                host: this.host
            });
        }

        // Set the model to empty, to get a new model field when calling getModel()
        this.model = {};
    }

    getProviderConfig() {
        if (Object.keys(this.providerConfig).length === 0) {
            this.providerConfig = {
                host: {
                    type: "text",
                    label: "Host URL (required)",
                    placeholder: "Type a host URL",
                    default: this.defaultConfig.host ?? null,
                    value: this.host ?? null
                },
                
                apiKey: {
                    type: "text",
                    label: "API key (optional)",
                    placeholder: "Type an api key",
                    default: null,
                    value: null
                }
            };
        }

        return this.providerConfig;
    }

    getProviderConfigValues() {        
        const providerConfigField = this.getProviderConfig();

        return Object.fromEntries(
            Object.entries(providerConfigField).map(([key, field]) => [
                key, field.value
            ])
        );
    }

    setProviderConfigValue(values) {
        this.#configure(values);

        const providerConfigField = this.getProviderConfig();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && providerConfigField[key]) {
                providerConfigField[key].value = value;
            }
        });
    }

    resetProviderConfigValues() {
        const providerConfigField = this.getProviderConfig();

        Object.entries(providerConfigField).forEach(([key]) => {
            providerConfigField[key].value = providerConfigField[key].default;
        });
    }

    // ### MODEL ####

    async listLocalModels() {
        if (!this.localClient) {
            return [];
        }

        const response = await this.localClient.list();
        return response.models.map((model) => model.model);
    }

    async listCloudModels() {
        if (!this.cloudClient) {
            return [];
        }

        const response = await this.cloudClient.list();
        return response.models.map((model) => model.model);
    }

    async listModels() {
        return [
            ...await this.listLocalModels(),
            ...await this.listCloudModels()
        ];
    }

    async pullModel(model) {
        if (!this.localClient) {
            throw new Error("Ollama provider is not configured.")
        }

        // Set the model to empty, to get a new model field when calling getModel()
        this.model = {};

        return await this.localClient.pull({
            model: model,
            stream: true
        });
    }

    async deleteModel(model) {
        if (!this.localClient) {
            throw new Error("Ollama provider is not configured.")
        }

        // Set the model to empty, to get a new model field when calling getModel()
        this.model = {};

        return await this.localClient.delete({ model: model });
    }

    async getModel() {
        if (Object.keys(this.model).length === 0) {
            const models = await this.listModels();
            
            this.model = {
                selectModel: {
                    type: "select",
                    label: "Select a model",
                    default: models[0] ?? null,
                    value: models[0] ?? null,
                    options: models,
                    disabled: models.length === 0
                },

                pullModel: {
                    type: "text",
                    label: "Pull a model",
                    placeholder: "Type a model name",
                    value: null
                },

                deleteModel: {
                    type: "select",
                    label: "Delete a model",
                    default: null,
                    value: null,
                    options: models,
                    disabled: models.length === 0
                }
            };
        }

        return this.model;
    }

    async getModelValue() {
        const modelField = await this.getModel();
        return modelField.selectModel.value;
    }

    async setModelValue(value) {
        const modelField = await this.getModel();
        modelField.selectModel.value = value;
    }

    async resetModelValue() {
        const modelField = await this.getModel();
        modelField.selectModel.value = modelField.selectModel.default;
    }

    // ### CONFIG ###

    getConfig() {
        if (Object.keys(this.config).length === 0) {
            this.config = {
                think: {
                    type: "select",
                    label: "Think",
                    default: "medium",
                    value: "medium",
                    options: ["low", "medium", "high", "max"],
                    disabled: false
                },

                temperature: {
                    type: "number",
                    label: "Temperature",
                    default: 0.7,
                    value: 0.7,
                    min: 0,
                    max: 2,
                    step: 0.1
                },

                topK: {
                    type: "number",
                    label: "Top K",
                    default: 50,
                    value: 50,
                    min: 0,
                    max: 100,
                    step: 1,
                },

                topP: {
                    type: "number",
                    label: "Top P",
                    default: 0.9,
                    value: 0.9,
                    min: 0,
                    max: 1,
                    step: 0.1
                },

                minP: {
                    type: "number",
                    label: "Min P",
                    default: 0.05,
                    value: 0.05,
                    min: 0,
                    max: 2,
                    step: 0.01
                },

                context: {
                    type: "number",
                    label: "Context",
                    default: 4096,
                    value: 4096,
                    min: 0,
                    step: 512
                },

                predict: {
                    type: "number",
                    label: "Predict",
                    default: 2048,
                    value: 2048,
                    min: 0,
                    step: 512
                }
            };
        }
        
        return this.config;
    }

    getConfigValues() {
        const configField = this.getConfig();

        return Object.fromEntries(
            Object.entries(configField).map(([key, field]) => [
                key, field.value
            ])
        );
    }

    setConfigValue(values) {
        const configField = this.getConfig();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && configField[key]) {
                configField[key].value = value;
            }
        });
    }

    resetConfigValues() {
        const configField = this.getConfig();

        Object.entries(configField).forEach(([key]) => {
            configField[key].value = configField[key].default;
        });
    }

    // ### RESET ALL VALUES ###

    async resetAllValues() {
        this.#configure(this.defaultConfig);
        this.resetProviderConfigValues();
        await this.resetModelValue();
        this.resetConfigValues();
    }

    // ### GENERATE A MESSAGE ###
    
    async generateMessage(chatMessages, model, config) { 
        if (!this.localClient) {
            throw new Error("Ollama provider is not configured.")
        }

        const response = await this.localClient.chat({
            model: model,
            messages: [
                {
                    role: "system",
                    content: env.systemPrompt
                },
                ...chatMessages
            ],
            options: {
                temperature: config.temperature,
                top_k: config.topK,
                top_p: config.topP,
                min_p: config.minP,
                num_ctx: config.context,
                num_predict: config.predict
            },
            think: config.think,
            stream: true
        });

        return response;
    }
}