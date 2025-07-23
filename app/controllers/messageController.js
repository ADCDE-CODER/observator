import { config } from "dotenv";
import OpenAI from "openai";
import { createChatMessage, readAllChatMessages, readChatMessage, updateChatMessage, deleteChatMessage } from "../models/messageModel.js";

config({ path: "./app/.env" });

const client = new OpenAI({ 
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.API_KEY 
});

async function createChatResponder(client, model, input, settings) {
    const completion = await client.chat.completions.create({
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
        messages: [
            {
                role: "user",
                content: input
            }
        ]
    })
    
    return completion.choices[0].message;
}

const createChatMessagePost = async (req, res) => {
    const user = req.user;
    
    if (user) {
        const { userInput, settings, chatId } = req.body.data;

        if (userInput) {
            if (settings) {
                if (chatId) {
                    try {
                        const aiResponse = await createChatResponder(client, "mistralai/mistral-small-3.2-24b-instruct:free", userInput, settings);
                        const userMessage = `${user.email}: ${userInput}`;
                        const aiMessage = `AI: ${aiResponse.content}`;

                        try {                          
                            const userMessageCreated = createChatMessage(chatId, "user", userMessage);
                            const aiMessageCreated = createChatMessage(chatId, "ai", aiMessage);
                            
                            console.log("Request: ", userMessage);
                            console.log("Response: ", aiMessage);

                            res.status(200).json({success: true, aiMessage: aiMessage, message: "Created AI message successfully"});
                        } catch (error) {
                            const errorMessage = `Failed to create user or AI message: ${error.message}`;
                            console.error(errorMessage);
                            res.status(500).json({success: false, error: errorMessage});
                        }

                    } catch (error) {                 
                        const errorMessage = `Failed to create AI response: ${error.message}`;
                        console.error(errorMessage);
                        res.status(500).json({success: false, error: errorMessage});
                    }
                } else {
                    res.status(400).json({success: false, error: "Missing chat ID"});
                }
            } else {
                res.status(400).json({success: false, error: "Missing chat settings"});
            }
        } else {
            res.status(400).json({success: false, error: "Missing user input"});
        }
    } else {
        res.status(400).json({success: false, error: "No user found"});
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