import { Ollama } from "ollama";
import { env } from "../../../config/env.js";

export default class OllamaProvider {
    // Private State Flags for Initialization Tracking
    #providerConfigInitialized = false;
    #modelInitialized = false; 
    #configInitialized = false;

    constructor(config = {}) {
        this.defaultConfig = config;
        this.#configure(config);
    }

    #setProviderConfigNeedsUpdate() {
        this.#providerConfigInitialized = false;
    }

    #setModelNeedsUpdate() {
        this.#modelInitialized = false;
    }

    #setConfigNeedsUpdate() {
        this.#configInitialized = false;
    }

    // --- Provider Config ---

    #configure(config = {}) {
        this.localHost = config.localHost?.trim();
        this.cloudHost = config.cloudHost?.trim();
        this.apiKey = config.apiKey?.trim();

        this.localClient = null;
        this.cloudClient = null;

        if (this.localHost) {
            this.localClient = new Ollama({ host: this.localHost });
        }
        
        if (this.apiKey && this.cloudHost) {
            this.cloudClient = new Ollama({
                host: this.cloudHost,
                headers: { Authorization: `Bearer ${this.apiKey}` },
            });
        }

        this.#setModelNeedsUpdate();  
    }

    getProviderConfig() {
        if (!this.#providerConfigInitialized) {
            this.providerConfig = {
                localHost: {
                    type: "text",
                    label: "Local host URL",
                    placeholder: this.defaultConfig.localHost ?? null,
                    default: this.defaultConfig.localHost ?? null,
                    value: this.localHost ?? null,
                },
                cloudHost: {
                    type: "text",
                    label: "Cloud host URL (optional)",
                    placeholder: this.defaultConfig.cloudHost ?? null,
                    default: null,
                    value: null,
                },
                apiKey: {
                    type: "text",
                    label: "Cloud API key (optional)",
                    placeholder: "Type an api key",
                    default: null,
                    value: null,
                }
            };

            this.#providerConfigInitialized = true;
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

    // --- Model ---

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

        this.#setModelNeedsUpdate(); 

        return await this.localClient.pull({
            model: model,
            stream: true
        });
    }

    async deleteModel(model) {
        if (!this.localClient) {
            throw new Error("Ollama provider is not configured.")
        }

        this.#setModelNeedsUpdate(); 

        return await this.localClient.delete({ model: model });
    }

    async getModel() {
        if (!this.#modelInitialized) {
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

            this.#modelInitialized = true;
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

    // --- General Config ---

    getConfig() {
        if (!this.#configInitialized) {
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

            this.#configInitialized = true;
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

    // --- Global Reset ---

    async resetAllValues() {
        this.#configure(this.defaultConfig);
        this.resetProviderConfigValues();
        await this.resetModelValue();
        this.resetConfigValues();
    }

    // --- Message Generation ---
    
    async generateMessage(chatMessages, model, config) { 
        // Pick exactly one client: local first, Cloud as fallback
        const client = this.localClient ?? this.cloudClient;

        if (!client) {
            throw new Error(
                "Ollama provider is not configured. " +
                "At least one of localClient or cloudClient must be set."
            );
        }

        const response = await client.chat({
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