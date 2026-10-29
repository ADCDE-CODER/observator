import fs from "fs";
import path from "path";

const systemPromptPath = process.env.SYSTEM_PROMPT_PATH ?? "src/config/system-prompt.prod.txt";

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
    whiteListOfModels: process.env.WHITE_LIST_OF_MODELS?.split(",") ?? "",
    ollamaLocalHostUrl: process.env.OLLAMA_LOCAL_HOST_URL ?? "http://localhost:11434",
    ollamaCloudHostUrl: process.env.OLLAMA_CLOUD_HOST_URL ?? "https://ollama.com",
    ollamaApiKey: process.env.OLLAMA_API_KEY ?? "",
    openAIUrl: process.env.OPENAI_URL ?? "https://api.openai.com/v1",
    openAIApiKey: process.env.OPENAI_API_KEY ?? "",
    accessToken: process.env.ACCESS_TOKEN_SECRET ?? "secret",
    refreshToken: process.env.REFRESH_TOKEN_SECRET ?? "refresh",
    databaseFilename: process.env.DATABASE_FILENAME ?? "./data/database.sqlite"
};