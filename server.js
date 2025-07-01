import { config } from "dotenv";
import OpenAI from "openai";
import readline from "readline";
import express from "express";
import cors from "cors";

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("Your port is: " + "http://localhost:" + PORT);
});

config();

const client = new OpenAI({ 
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.API_KEY 
});

app.post("/prompt", async (req, res) => {
    console.log("Request: " + req.body.prompt);

    const responder = async (input) => {
        try {
            return await createChatResponder(client, "mistralai/mistral-small-3.2-24b-instruct:free", input, 10);
        } catch (error) {
            console.log(error);
        }
    }

    const output = await responder(req.body.prompt);
    console.log("Response: ", output.content);
    res.json(output.content);
})

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