import { config } from "dotenv";
import OpenAI from "openai";
import { createChatMessage, readAllChatMessages, readChatMessage, updateChatMessage, deleteChatMessage } from "../models/messagesModel.js";

config({ path: "./app/.env" });

const client = new OpenAI({ 
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.API_KEY 
});

async function createChatResponder(client, model, input, settings) {
    try {
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
    } catch (error) {
        console.log(error);
    }
}

const createChatMessagePost = async (req, res) => {
    const user = req.user;
    
    if (user) {
        const { userInputValue, chatSettings, selectedChatId } = req.body;

        if (userInputValue) {
            if (selectedChatId) {
                try {
                    const userMessage = `${user.email}: ${userInputValue}`;

                    const aiResponse = await createChatResponder(client, "mistralai/mistral-small-3.2-24b-instruct:free", userInputValue, chatSettings);
                    const aiMessage = `AI: ${aiResponse.content}`;
                    
                    const userMessageCreated = createChatMessage(selectedChatId, "user", userMessage);
                    const aiMessageCreated = createChatMessage(selectedChatId, "ai", aiMessage);
                    
                    console.log("Request: ", userMessage);
                    console.log("Response: ", aiMessage);

                    res.status(200).json({ success: true, aiMessage: aiMessage });
                } catch (error) {
                    res.status(500).json( { success:false, error: error.message } );
                }
            } else {
                res.status(400).json({ success: false, error: "Missing chat ID" });
            }
        } else {
            res.status(200).json( { success: false, error: "Failed to read user input" } );
        }
    } else {
        res.status(200).json( { success: false, error: "Failed to access user" } );
    }
};

const readAllChatMessagesGet = (req, res) => {
    try {
        const chatMessages = readAllChatMessages();
        res.status(200).json({ success: true, chatMessages});   
    } catch (error) {
        console.error("Failed to read all chat messages:", error.message);
        res.status(500).json({ success: false, error: error.message })
    }
};

const readChatMessagePost = (req, res) => {
    const { selectedChatId } = req.body; 
    
    if (selectedChatId) {
        try {
            const chatMessages = readChatMessage(selectedChatId);
            res.status(200).json({ success: true, chatMessages});   
        } catch (error) {
            console.error("Failed to read all chat messages:", error.message);
            res.status(500).json({ success: false, error: error.message })
        }
    } else {
        res.status(400).json({ success: false, error: "Missing chat ID" });
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