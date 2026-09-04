export default class OpenAIProvider {
    constructor(openAIClient) {
        this.openAIClient = openAIClient;
    }

    async getModels() {
        const response = await this.openAIClient.models.list();

        return response.data.map((model) => ({
            name: model.id
        }));
    }
    
    async pullModel(model) {
        return await this.openAIClient.pull({
            model: model,
            stream: true
        });
    }

    async generateMessage(chatMessages, metadata) {
        const response = await this.openAIClient.chat.completions.create({
            model: metadata.model,
            reasoning: {
                effort: metadata.effort,
                max_tokens: metadata.reasoning_max_tokens,
                exclude: metadata.exclude
            },  
            usage: {
                include: metadata.include
            },
            stream: true,
            max_tokens: metadata.max_tokens,
            temperature: metadata.temperature,
            top_p: metadata.top_p,
            top_k: metadata.top_k,
            frequency_penalty: metadata.frequency_penalty,
            presence_penalty: metadata.presence_penalty,
            repetition_penalty: metadata.repetition_penalty,
            logit_bias: metadata.logit_bias,
            messages: chatMessages
        });

        return response;
    }
}