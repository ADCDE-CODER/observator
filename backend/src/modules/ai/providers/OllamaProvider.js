import { Ollama } from "ollama";

export default class OllamaProvider {
    #providerConfigInitialized = false;
    #modelInitialized = false; 
    #configInitialized = false;
    #allowedThinkValues = null;

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
        this.#allowedThinkValues = null;
    }

    #extractValues(fields) {
        return Object.fromEntries(
            Object.entries(fields).map(([key, field]) => [key, field.value])
        );
    }

    #insertValues(fields, values) {
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && fields[key]) {
                fields[key].value = value;
            }
        });
    }

    #resetValues(fields) {
        Object.entries(fields).forEach(([key]) => {
            fields[key].value = fields[key].default;
        });
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
        return this.#extractValues(this.getProviderConfig());
    }

    setProviderConfigValue(values) {
        this.#configure(values);
        this.#setModelNeedsUpdate();
        this.#setConfigNeedsUpdate(); 
        this.#insertValues(this.getProviderConfig(), values);
    }

    resetProviderConfigValues() {
        this.#resetValues(this.getProviderConfig());
    }

    // --- Model ---

    #validateModel(model) {
        if (typeof model !== "string" || model.trim().length === 0) {
            throw new Error("Model name must be a non-empty string.");
        }

        return model.trim();
    }

    async showModelDetails(model) {
        model = this.#validateModel(model);
        const client = this.localClient ?? this.cloudClient;

        if (!client) {
            throw new Error("No client available to fetch model details.");
        }
        
        return await client.show({ model });
    }

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
            throw new Error("Cannot pull model: localClient is not configured.");
        }

        model = this.#validateModel(model);

        this.#setModelNeedsUpdate(); 

        return await this.localClient.pull({
            model: model,
            stream: true
        });
    }

    async deleteModel(model) {
        if (!this.localClient) {
            throw new Error("Cannot delete model: localClient is not configured.");
        }

        model = this.#validateModel(model);

        this.#setModelNeedsUpdate(); 

        return await this.localClient.delete({ model: model });
    }

    async getModel() {
        if (!this.#modelInitialized) {
            this.#modelInitialized = true;

            const models = await this.listModels();
            const hasLocal = this.localClient !== null;

            const modelFields = {
                selectModel: {
                    type: "select",
                    label: "Select a model",
                    default: models[0] ?? null,
                    value: models[0] ?? null,
                    options: models,
                    disabled: models.length === 0
                },
            };

            // pullModel & deleteModel only when localClient exists
            if (hasLocal) {
                modelFields.pullModel = {
                    type: "text",
                    label: "Pull a model",
                    placeholder: "Type a model name",
                    value: null
                };

                modelFields.deleteModel = {
                    type: "select",
                    label: "Delete a model",
                    default: null,
                    value: null,
                    options: models,
                    disabled: models.length === 0
                };
            }

            this.model = modelFields;
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
        this.#setConfigNeedsUpdate();
    }

    async resetModelValue() {
        const modelField = await this.getModel();
        modelField.selectModel.value = modelField.selectModel.default;
    }

    // --- General Config ---

    #validateConfig(config) {
        if (config == null || typeof config !== "object") {
            throw new Error("Config must be an object.");
        }

        const errors = [];

        // temperature: 0 - 2
        if (config.temperature != null) {
            if (typeof config.temperature !== "number" || config.temperature < 0 || config.temperature > 2) {
                errors.push("temperature must be a number between 0 and 2.");
            }
        }

        // topK: positive integer
        if (config.topK != null) {
            if (!Number.isInteger(config.topK) || config.topK < 1) {
                errors.push("topK must be a positive integer.");
            }
        }

        // topP: 0 - 1
        if (config.topP != null) {
            if (typeof config.topP !== "number" || config.topP < 0 || config.topP > 1) {
                errors.push("topP must be a number between 0 and 1.");
            }
        }

        // minP: 0 - 1
        if (config.minP != null) {
            if (typeof config.minP !== "number" || config.minP < 0 || config.minP > 1) {
                errors.push("minP must be a number between 0 and 1.");
            }
        }

        // context: positive integer
        if (config.context != null) {
            if (!Number.isInteger(config.context) || config.context < 1) {
                errors.push("context must be a positive integer.");
            }
        }

        // predict: positive integer
        if (config.predict != null) {
            if (!Number.isInteger(config.predict) || config.predict < 1) {
                errors.push("predict must be a positive integer.");
            }
        }

        // think: string
        if (config.think != null) {
            if (this.#allowedThinkValues && Array.isArray(this.#allowedThinkValues)) {
                if (!this.#allowedThinkValues.includes(config.think)) {
                    errors.push(
                        `think must be one of: ${this.#allowedThinkValues.join(", ")}. ` +
                        `Got: ${JSON.stringify(config.think)}`
                    );
                }
            } else {
                errors.push("This model does not support thinking.");
            }
        }

        if (errors.length > 0) {
            throw new Error(`Invalid config: ${errors.join(" ")}`);
        }

        return config;
    }
    
    async getConfig() {
        if (!this.#configInitialized) {
            const modelValue = await this.getModelValue();
            const modelDetails = modelValue ? await this.showModelDetails(modelValue) : null;

            const thinking = modelDetails?.thinking;
            const thinkField = {};
            
            if (thinking && Array.isArray(thinking.values) && thinking.values.length > 0) {
                this.#allowedThinkValues = thinking?.values ?? null;
                thinkField.think = {
                    type: "select",
                    label: "Think",
                    default: thinking.default ?? thinking.values[0],
                    value: thinking.default ?? thinking.values[0],
                    options: thinking.values,
                    disabled: false,
                };
            }

            const optionsField = {
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

            this.config = Object.assign(thinkField, optionsField);
            this.#configInitialized = true;
        }
        
        return this.config;
    }

    async getConfigValues() {
        return this.#extractValues(await this.getConfig());
    }

    async setConfigValue(values) {
        this.#insertValues(await this.getConfig(), values);
    }

    async resetConfigValues() {
        this.#resetValues(await this.getConfig());
    }

    // --- Global Reset ---

    async resetAllValues() {
        this.#configure(this.defaultConfig);
        this.resetProviderConfigValues();
        await this.resetModelValue();
        this.resetConfigValues();

        this.#setModelNeedsUpdate();  
        this.#setConfigNeedsUpdate();
    }

    // --- Message Generation ---
    
    async generateMessage(systemPrompt, chatMessages, model, config) {
        model = this.#validateModel(model);
        config = this.#validateConfig(config);

        // Pick exactly one client: local first, Cloud as fallback
        const client = this.localClient ?? this.cloudClient;

        if (!client) {
            throw new Error(
                "Ollama provider is not configured. " +
                "At least one of localClient or cloudClient must be set."
            );
        }

        const body = {
            model: model,
            messages: [
                { role: "system", content: systemPrompt ?? "" },
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
            think: config.think ?? undefined,
            stream: true
        };

        const response = await client.chat(body);

        return response;
    }
}