import OpenAI from "openai";

export default class OpenAIProvider {
    #providerConfigInitialized = false;
    #modelInitialized = false;
    #configInitialized = false;
    #allowedReasoningEfforts = null;

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
        this.#allowedReasoningEfforts = null;
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
        this.baseURL = config.baseURL?.trim();
        this.apiKey = config.apiKey?.trim();

        this.client = null;

        if (this.apiKey) {
            this.client = new OpenAI({
                apiKey: this.apiKey,
                baseURL: this.baseURL || undefined,
            });
        }
    }

    getProviderConfig() {
        if (!this.#providerConfigInitialized) {
            this.providerConfig = {
                baseURL: {
                    type: "text",
                    label: "Base URL (optional)",
                    placeholder: this.defaultConfig.baseURL ?? null,
                    default: this.defaultConfig.baseURL ?? null,
                    value: this.baseURL ?? null,
                },
                apiKey: {
                    type: "text",
                    label: "API key (required)",
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

        if (!this.client) {
            throw new Error("No client available to fetch model details.");
        }

        return await this.client.models.retrieve(model);
    }

    async listModels() {
        if (!this.client) {
            return [];
        }

        const response = await this.client.models.list();
        return response.data.map((model) => model.id);
    }

    async getModel() {
        if (!this.#modelInitialized) {
            this.#modelInitialized = true;

            const models = await this.listModels();

            this.model = {
                selectModel: {
                    type: "select",
                    label: "Select a model",
                    default: models[0] ?? null,
                    value: models[0] ?? null,
                    options: models,
                    disabled: models.length === 0,
                },
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

        // topP: 0 - 1
        if (config.topP != null) {
            if (typeof config.topP !== "number" || config.topP < 0 || config.topP > 1) {
                errors.push("topP must be a number between 0 and 1.");
            }
        }

        // maxTokens: positive integer
        if (config.maxTokens != null) {
            if (!Number.isInteger(config.maxTokens) || config.maxTokens < 1) {
                errors.push("maxTokens must be a positive integer.");
            }
        }

        // frequencyPenalty: -2 - 2
        if (config.frequencyPenalty != null) {
            if (typeof config.frequencyPenalty !== "number" || config.frequencyPenalty < -2 || config.frequencyPenalty > 2) {
                errors.push("frequencyPenalty must be a number between -2 and 2.");
            }
        }

        // presencePenalty: -2 - 2
        if (config.presencePenalty != null) {
            if (typeof config.presencePenalty !== "number" || config.presencePenalty < -2 || config.presencePenalty > 2) {
                errors.push("presencePenalty must be a number between -2 and 2.");
            }
        }

        // reasoningEffort: string
        if (config.reasoningEffort != null) {
            if (this.#allowedReasoningEfforts && Array.isArray(this.#allowedReasoningEfforts)) {
                if (!this.#allowedReasoningEfforts.includes(config.reasoningEffort)) {
                    errors.push(
                        `reasoningEffort must be one of: ${this.#allowedReasoningEfforts.join(", ")}. ` +
                        `Got: ${JSON.stringify(config.reasoningEffort)}`
                    );
                }
            } else {
                errors.push("This model does not support reasoning.");
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

            // Reasoning models (o1, o3, o4) support reasoning_effort
            const isReasoningModel =
                modelValue?.startsWith("o1") ||
                modelValue?.startsWith("o3") ||
                modelValue?.startsWith("o4");

            const reasoningField = {};

            if (isReasoningModel) {
                this.#allowedReasoningEfforts = ["low", "medium", "high"];
                reasoningField.reasoningEffort = {
                    type: "select",
                    label: "Reasoning Effort",
                    default: "medium",
                    value: "medium",
                    options: ["low", "medium", "high"],
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
                    step: 0.1,
                },
                topP: {
                    type: "number",
                    label: "Top P",
                    default: 0.9,
                    value: 0.9,
                    min: 0,
                    max: 1,
                    step: 0.1,
                },
                maxTokens: {
                    type: "number",
                    label: "Max Tokens",
                    default: 2048,
                    value: 2048,
                    min: 1,
                    step: 256,
                },
                frequencyPenalty: {
                    type: "number",
                    label: "Frequency Penalty",
                    default: 0,
                    value: 0,
                    min: -2,
                    max: 2,
                    step: 0.1,
                },
                presencePenalty: {
                    type: "number",
                    label: "Presence Penalty",
                    default: 0,
                    value: 0,
                    min: -2,
                    max: 2,
                    step: 0.1,
                },
            };

            this.config = Object.assign(reasoningField, optionsField);
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

        if (!this.client) {
            throw new Error(
                "OpenAI provider is not configured. " +
                "An API key must be set."
            );
        }

        const body = {
            model,
            messages: [
                { role: "system", content: systemPrompt ?? "" },
                ...chatMessages,
            ],
            temperature: config.temperature,
            top_p: config.topP,
            max_tokens: config.maxTokens,
            frequency_penalty: config.frequencyPenalty,
            presence_penalty: config.presencePenalty,
            stream: true,
        };

        // Only attach reasoning for models that support it
        if (config.reasoningEffort) {
            body.reasoning = { effort: config.reasoningEffort };
        }

        const response = await this.client.chat.completions.create(body);

        return response;
    }
}