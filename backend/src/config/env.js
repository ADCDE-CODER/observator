import fs from "fs";
import path from "path";

const systemPromptPath = process.env.SYSTEM_PROMPT_PATH;

if (!systemPromptPath) {
    throw new Error("SYSTEM_PROMPT_PATH enviroment variable is required.");
}

const fullSystemPromptPath = path.resolve(process.cwd(), systemPromptPath);

if (!fs.existsSync(fullSystemPromptPath)) {
    throw new Error(`System prompt file not found: ${fullSystemPromptPath}`);
}

const systemPrompt = fs.readFileSync(fullSystemPromptPath, "utf-8");

export const env = {
    port: Number(process.env.PORT ?? 3000),
    systemPrompt: systemPrompt,
    whiteListOfModels: process.env.WHITE_LIST_OF_MODELS.split(","),
    ollamaLocalHostUrl: process.env.OLLAMA_LOCAL_HOST_URL,
    ollamaCloudHostUrl: process.env.OLLAMA_CLOUD_HOST_URL,
    ollamaApiKey: process.env.OLLAMA_API_KEY,
    openAIUrl: process.env.OPENAI_URL,
    openAIApiKey: process.env.OPENAI_API_KEY,
    accessToken: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET,
    databaseFilename: process.env.DATABASE_FILENAME
};