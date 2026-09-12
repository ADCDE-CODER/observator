export default class OllamaProvider {
    constructor(ollamaClient) {
        this.ollamaClient = ollamaClient;
    }

    async getModels() {
        const response = await this.ollamaClient.list();
        return response.models.map((model) => model.model);
    }

    async pullModel(model) {
        return await this.ollamaClient.pull({
            model: model,
            stream: true
        });
    }

    async generateMessage(chatMessages, metadata) {                
        const response = await this.ollamaClient.chat({
            model: metadata.model,
            messages: chatMessages,
            options: {
                temperature: metadata.temperature,
                top_k: metadata.top_k,
                top_p: metadata.top_p,
                min_p: metadata.min_p,
                num_ctx: metadata.context,
                num_predict: metadata.predict
            },
            think: metadata.think,
            stream: true
        });

        return response;
    }

    getConfig() {
        return {
            system_content: {
                type: "text",
                label: "System Content",
                default: "Do normal",
                value: "Do normal"
            },

            think: {
                type: "select",
                label: "Think",
                default: "medium",
                value: "medium",
                options: ["low", "medium", "high", "max"]
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

            top_k: {
                type: "number",
                label: "Top K",
                default: 50,
                value: 50,
                min: 0,
                max: 100,
                step: 1,
            },

            top_p: {
                type: "number",
                label: "Top P",
                default: 0.9,
                value: 0.9,
                min: 0,
                max: 1,
                step: 0.1
            },

            min_p: {
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