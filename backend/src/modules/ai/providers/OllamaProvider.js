import { Ollama } from "ollama";
import { env } from "../../../config/env.js";

export default class OllamaProvider {
    constructor(config = {}) {
        this.configure(config);
    }

    configure(config = {}) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL;

        this.client = null;

        if (this.isConfigured()) {
            this.client = new Ollama({
                headers: {
                    Authorization: `Bearer ${config.apiKey}`
                },
                host: config.baseURL
            });
        }
    }

    isConfigured() {
        return Boolean(this.apiKey || this.baseURL);
    }

    async getModels() {
        const response = await this.client.list();
        return response.models.map((model) => model.model);
    }

    async pullModel(model) {
        if (!this.isConfigured()) {
            throw new Error("Ollama provider is not configured.")
        }

        return await this.client.pull({
            model: model,
            stream: true
        });
    }

    async deleteModel(model) {
        if (!this.isConfigured()) {
            throw new Error("Ollama provider is not configured.")
        }

        return await this.client.delete({ model: model });
    }

    async generateMessage(chatMessages, model, config) { 
        if (!this.isConfigured()) {
            throw new Error("Ollama provider is not configured.")
        }

        const response = await this.client.chat({
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

    getConfig() {
        return {
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
}