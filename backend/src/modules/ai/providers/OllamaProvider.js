export default class OllamaProvider {
    constructor(ollamaClient) {
        this.ollamaClient = ollamaClient;
    }

    async getModels() {
        const response = await this.ollamaClient.list();

        return response.models.map((model) => ({
            name: model.name
        }));
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
            stream: true,
            think: metadata.think
        });

        return response;
    }
}