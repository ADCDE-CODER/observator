import { config } from "dotenv";
import OpenAI from "openai";
import readline from "readline";

async function createChatResponder(client, model, input, maxTokens) {
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
}

function createUserInterface(io, responder) {
    io.prompt();
    io.on("line", async (input) => {
        const output = await responder(input);
        console.log(output);
        io.prompt();
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
        return await createChatResponder(client, "mistralai/mistral-small-3.2-24b-instruct:free", input, 10);
    }

    // Pass io and responer function
    createUserInterface(io, responder);
}

main();