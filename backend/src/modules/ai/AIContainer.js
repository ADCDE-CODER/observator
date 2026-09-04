import { env } from "../../config/env.js";
import { Ollama } from "ollama";
import OpenAI from "openai";
import AIService from "./AIService.js";
import OllamaProvider from "./providers/OllamaProvider.js";
import OpenAIProvider from "./providers/OpenAIProvider.js";

const whiteListOfModels = [
    "gemma4:latest",
    "qwen3.5:9b"
];

const ollamaClient = new Ollama({
    host: env.ollamaUrl,
    headers: {
        Authorization: `Bearer ${env.openAIApiKey}`
    }
});

const openaiClient = new OpenAI({ 
    baseURL: env.openAIUrl,
    apiKey: env.openAIApiKey 
});

const ollamaProvider = new OllamaProvider(ollamaClient);
const openaiProvider = new OpenAIProvider(openaiClient);

const aiService = new AIService({ollama: ollamaProvider, openai: openaiProvider}, whiteListOfModels);

export { aiService };