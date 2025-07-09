import { config } from "dotenv";
import OpenAI from "openai";
import { app } from "./app.js";
import jwt from "jsonwebtoken";

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Your port is: " + "http://localhost:" + PORT);
});

config({ path: "./app/.env" });

const client = new OpenAI({ 
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.API_KEY 
});

function authToken(req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(" ")[1];

    if (token) {
        try {
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(403).json({ error: "Invalid or expired token" });
        }
    } else {
        return res.status(401).json({ error: "Access denied: No token" })
    }
};

app.post("/chat/prompt", authToken, async (req, res) => {
    const user = req.user;
    
    if (user) {
        const { userInput } = req.body;

        if (userInput) {
            console.log("Request: " + userInput);
            
            const responder = async (input) => {
                try {
                    return await createChatResponder(client, "mistralai/mistral-small-3.2-24b-instruct:free", input, 10);
                } catch (error) {
                    res.status(500).json( { success:false, error: error.message } );
                }
            }
            const chatOutput = await responder(userInput);
        
            console.log("Response: ", chatOutput.content);
            
            res.status(200).json( { success: true, output: chatOutput.content });
        } else {
            res.status(200).json( { success: false, error: "Failed to read user input" } );
        }
    } else {
        res.status(200).json( { success: false, error: "Failed to access user" } );
    }
});

async function createChatResponder(client, model, input, maxTokens) {
    try {
        const completion = await client.chat.completions.create({
            model: model,
            max_tokens: maxTokens,
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

function createUserInterface(io, responder) {
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

/* function main() {
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