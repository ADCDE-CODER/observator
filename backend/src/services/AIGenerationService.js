import OpenAI from "openai";
import { Ollama } from "ollama";
import { config } from "dotenv";

config({ path: "./app/.env" });

export default class AIGenerationService {
    constructor() {
        this.openai = new OpenAI({ 
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.API_KEY 
        });

        this.ollama = new Ollama({
            host: 'http://127.0.0.1:11434',
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`
            }
        });
    }
    
    async *generateResponse(chatMessages, metadata) {
        if (!chatMessages) {
            const error = new Error("Chat messages are required");
            error.status = 400;
            throw error;
        }

        if (chatMessages.length !== 0) {
            const lastIndex = chatMessages.length - 1;

            if (!chatMessages[lastIndex].content) {
                const error = new Error("Content is required");
                error.status = 400;
                throw error;
            }
        }
   
        if (!metadata.provider || !metadata.model) {
            const error = new Error("Invalid metadata configuration");
            error.status = 400;
            throw error;
        }

        // Get only role, content, and images
        chatMessages = chatMessages.map(({role, content, images}) => {
            return {role, content, images};
        });

        try {
            if (metadata.provider.toLowerCase() === "openai") {
                const openAICompletion = await this.openai.chat.completions.create({
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
                })
                
                return openAICompletion.choices[0];
            } else if (metadata.provider.toLowerCase() === "ollama") {
                const streamOllama = await this.ollama.chat({
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

                let inThinking = false

                // Stream the content chunk by chunk
                for await (const chunk of streamOllama) {
                    if (!chunk || !chunk.message) {
                        continue;
                    }

                    if(chunk.message.thinking) {
                        if(!inThinking) {
                            inThinking = true;
                            yield { done: chunk.done, role: chunk.message.role, model: chunk.model, thinking: "Thinking:\n\n" };
                        }

                        yield { done: chunk.done, role: chunk.message.role, model: chunk.model, thinking: chunk.message.thinking };
                    } else if (chunk.message.content) {
                        if(inThinking) {
                            inThinking = false;
                            yield { done: chunk.done, role: chunk.message.role, model: chunk.model, thinking: "\n\nAnswer:\n" };
                        }
                        
                        yield { done: chunk.done, role: chunk.message.role, model: chunk.model, content: chunk.message.content };
                    }

                    if (chunk.done) {
                        yield { done: chunk.done, role: chunk.message.role, model: chunk.model, createdAt: chunk.created_at };
                    }
                }
            } else {
                const error = new Error(`Unsupported provider: ${metadata.provider}.`);
                error.status = 400;
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }
}