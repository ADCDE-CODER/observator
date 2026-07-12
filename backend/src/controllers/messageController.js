import { config } from "dotenv";
import OpenAI from "openai";
import { Ollama } from "ollama";
import { createChatMessage, readAllChatMessages, readChatMessage, updateChatMessage, deleteChatMessage } from "../models/messageModel.js";

config({ path: "./app/.env" });

const openai = new OpenAI({ 
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.API_KEY 
});

const ollama = new Ollama({
    host: 'http://127.0.0.1:11434',
    headers: {
        Authorization: `Bearer ${process.env.API_KEY}`
    }
});

async function generateResponse(client, model, chatHistory, settings) {
    if (client === "openai") {
        const openAICompletion = await client.chat.completions.create({
            model: model,
            reasoning: {
                effort: settings.effort,
                max_tokens: settings.reasoning_max_tokens,
                exclude: settings.exclude
            },  
            usage: {
                include: settings.include
            },
            stream: settings.stream,
            max_tokens: settings.max_tokens,
            temperature: settings.temperature,
            seed: settings.seed,
            top_p: settings.top_p,
            top_k: settings.top_k,
            frequency_penalty: settings.frequency_penalty,
            presence_penalty: settings.presence_penalty,
            repetition_penalty: settings.repetition_penalty,
            logit_bias: settings.logit_bias,
            messages: chatHistory
        })
        
        return openAICompletion.choices[0];
    } else if (client === "ollama") {
        const ollamaCompletion = await ollama.chat({
            model: model,
            messages: chatHistory,
            stream: true,
            options: {
                num_ctx: 8192,     // Sets the total memory available for the chat (History + Output)
                num_predict: 8192  // Sets how many tokens can be written
            }
        });
        
        return ollamaCompletion;
    } else {
        throw new Error(`Unsupported client: ${client}. Must be 'openai' or 'ollama'.`);
    }
};

function validateRequest(req) {    
    if (!req.user || !req.body || !req.body.data) {
        return { isValid: false, message: "Missing user or request data." };
    }

    const { userInput, settings, chatId } = req.body.data;

    if (!userInput) { return { isValid: false, message: "Missing user input." }; }
    if (!settings) { return { isValid: false, message: "Missing settings." }; }
    if (!chatId) { return { isValid: false, message: "Missing chat ID." }; }

    return { isValid: true };
};

const createChatMessagePost = async (req, res) => {
    const validateResult = validateRequest(req);

    if (!validateResult.isValid) {
        return res.status(400).json({ success: false, error: validationResult.message });
    }

    const { userInput, settings, chatId } = req.body.data;
    let conversationContext = [];
    let fullAiMessageContent = "";
    const client = "ollama"
    const model = "gemma4:latest";

    // Reads chat history and builds the context array.
    try {
        let chatMessages;

        try {
            chatMessages = readChatMessage(chatId);
        } catch (dbError) {
            console.error(`[WARNING] Failed to read chat history for ID ${chatId}. Proceeding with empty context. Error:`, dbError);
            // If failure occurs, then continue with empty array and log the warning.
            chatMessages = []; 
        }

        if (chatMessages && chatMessages.length > 0) {
            const messages = chatMessages.map(item => ({
                role: "assistant",
                content: item.message,
            }));

            messages.forEach(message => {
                conversationContext.push({ role: message.role, content: message.content });
            });
        }

        conversationContext.push({role: "user", content: userInput})
    } catch (setupError) {
        console.error("Critical error during chat context setup:", setupError);
        return res.status(500).json({ success: false, error: "Internal system error during chat context setup." });
    }

    // Streaming phase
    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let stream;

        try {
            stream = await generateResponse(client, model, conversationContext, settings);
        } catch (error) {
            console.error("Streaming setup error:", error);
            return res.status(500).json({ success: false, error: `Failed to initiate AI chat response: ${error.message}` });
        }

        // Stream the content chunk by chunk
        for await (const chunk of stream) {
            if (!chunk || !chunk.message || !chunk.message.content) {
                continue;
            }

            fullAiMessageContent += chunk.message.content;
            const dataToSend = { chunk: chunk.message.content };
            res.write(`data: ${JSON.stringify(dataToSend)}\r\n\r\n`); 
        }
        
        // End response when streaming is complete. 
        res.end();
    } catch (streamingError) {
        console.error("Streaming process failure:", streamingError);
        
        if (!res.headersSent) { 
            return res.status(500).json({ success: false, error: `Failed to handle stream or response: ${streamingError.message}` });
        }
    } finally {
        console.log("Streaming complete. Attempting to save data...");
        
        try {            
            createChatMessage(chatId, "user", userInput); 
            createChatMessage(chatId, "ai", fullAiMessageContent);
            console.log("User and AI message saved successfully.");
        } catch (dbError) {
            const errorMessage = `[ERROR] Failed to persist chat history for ID ${chatId}: ${dbError.message}`;
            console.error(errorMessage);
        }
    }
};

const readAllChatMessagesGet = (req, res) => {
    try {
        const chatMessages = readAllChatMessages();
        res.status(200).json({success: true, chatMessages: chatMessages, message: "Successful to get all messages"});   
    } catch (error) {
        const errorMessage = `Failed to read all chat messages: ${error.message}`;
        console.error(errorMessage);
        res.status(500).json({success: false, error: errorMessage});
    }
};

const readChatMessagePost = (req, res) => {
    const { chatId } = req.body.data; 
    
    if (chatId) {
        try {
            const chatMessages = readChatMessage(chatId);
            res.status(200).json({success: true, chatMessages: chatMessages, message: "Successful to get message"});   
        } catch (error) {
            const errorMessage = `Failed to read message: ${error.message}`;
            console.error(errorMessage);
            res.status(500).json({success: false, error: errorMessage});
        }
    } else {
        res.status(400).json({success: false, error: "Missing chat ID"});
    }
};

/* function createUserInterface(io, responder) {
    io.prompt();
    io.on("line", async (input) => {
        try {
            const output = await responder(input);
            io.prompt();
            console.log(output);
        } catch (error) {
            console.log(error);
        }
    });
}

function main() {
    config();
    
    const client = new OpenAI({ 
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.API_KEY 
    });

    const io = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    // Responder function
    const responder = async (input) => {
        try {
            return await createChatResponder(client, "mistralai/mistral-small-3.2-24b-instruct:free", input, 10);
        } catch (error) {
            console.log(error);
        }
    }

    // Pass io and responer function
    createUserInterface(io, responder);
}

main(); */

export { createChatMessagePost, readAllChatMessagesGet, readChatMessagePost };