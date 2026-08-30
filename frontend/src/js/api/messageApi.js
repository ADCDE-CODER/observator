export async function createMessage(userChatMessage, chatId, userToken, onChunk) {
    const url = `/api/chats/${chatId}/chatmessages`;
    console.log(JSON.stringify(userChatMessage))

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(userChatMessage)
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
        
    if (!reader) {
        throw new Error("Response body could not be read (not a stream).");
    }

    while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        if (value) {
            // Decode the binary chunk
            const lines = decoder.decode(value).split("\n"); 

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = line.replace("data: ", "");
                    const assistantChatMessage  = JSON.parse(data);

                    // Call the provided callback function with the text chunk
                    onChunk(assistantChatMessage);                                
                }
            }                        
        }
    } 
};

export async function getMessage(chatId, userToken) {
    const url = `/api/chats/${chatId}/chatMessages`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        }
    });
    
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }
    
    return result;
};