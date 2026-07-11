import { createMessage, getMessage } from "../api/messageApi.js";

async function addMessages(user, userInputValue, token, chatSettings, selectedChatId, onChunkReceived) {
    if(!user) {
        alert("No user found!");
    }
    
    if(!userInputValue.trim()) {
        alert("Please enter a message.");
    } 
        
    const result = await createMessage(token, userInputValue, chatSettings, selectedChatId);

    try {                
        if (!result.ok) {
            const errorBody = await result.text();
            throw new Error(`HTTP Error ${result.status}: ${errorBody}`);
        }

        if (!result.body) {
            throw new Error("Response stream missing: The response body could not be accessed or is empty.");
        }
        
        const reader = result.body.getReader();
        
        if (!reader) {
            throw new Error("Response body could not be read (not a stream).");
        }
        
        const decoder = new TextDecoder('utf-8');
        
        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            if (value) {
                // Decode the binary chunk
                const lines = decoder.decode(value).split("\n"); 

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        const content  = JSON.parse(data);

                        // Call the provided callback function with the text chunk
                        onChunkReceived(content.chunk);                                
                    }
                }                        
            }
        } 
    } catch (error) {
        throw new Error(`Error during message creation: ${error}`);
    }  
};

async function getMessages(user, chatId) {
    if (user) {
        const result = await getMessage(chatId);

        if (result.ok && result.success) {
            return result.chatMessages;
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }
    } else {
        alert("No user found!");
    }
};

export { addMessages, getMessages };