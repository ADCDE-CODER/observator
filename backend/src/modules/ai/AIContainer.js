import { env } from "../../config/env.js";
import AIService from "./AIService.js";
import OllamaProvider from "./providers/OllamaProvider.js";
import OpenAIProvider from "./providers/OpenAIProvider.js";

const ollama = new OllamaProvider({ 
    localHost: env.ollamaLocalHostUrl || undefined,
    cloudHost: env.ollamaCloudHostUrl || undefined,
    apiKey: env.ollamaApiKey || undefined, 
});
const openAI = new OpenAIProvider({ 
    apiKey: env.openAIApiKey || undefined, 
    baseURL: env.openAIUrl || undefined
});

const providers = {
    ollama, 
    openAI
};

const aiService = new AIService(providers, env.whiteListOfModels);

export { aiService };