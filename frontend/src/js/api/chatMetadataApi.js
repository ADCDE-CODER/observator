export async function readChatMetadata(chatId, userToken) {
    const url = `/api/chats/${chatId}/chatMetadata`;    
    
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

export async function updateProviderChatMetadata(provider, chatId, userToken) {
    const url = `/api/chats/${chatId}/chatMetadata/provider`;    
    
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(provider)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }
    
    return result;
};

export async function updateProviderConfigChatMetadata(providerConfig, chatId, userToken) {
    const url = `/api/chats/${chatId}/chatMetadata/providerconfig`;    
    
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(providerConfig)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }
    
    return result;
};

export async function updateModelChatMetadata(model, chatId, userToken, onChunk) {
    const url = `/api/chats/${chatId}/chatMetadata/model`;    
    
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(model)
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
            const text = decoder.decode(value);
            const lines = text.split("\n");
            let eventType;

            for (const line of lines) {

                // Get the event type
                if (line.startsWith("event: ")) {
                    eventType = line.replace("event: ", "").trim();
                }

                // Get the data
                if (line.startsWith("data: ")) {
                    const data = line.replace("data: ", "").trim();
                    const parsedData  = JSON.parse(data);
                    
                    onChunk(eventType, parsedData);                            
                }
            }                        
        }
    } 
};

export async function updateConfigChatMetadata(config, chatId, userToken) {
    const url = `/api/chats/${chatId}/chatMetadata/config`;    
    
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(config)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }
    
    return result;
};

export async function resetChatMetadata(endpoint, chatId, userToken) {
    const url = `/api/chats/${chatId}/chatMetadata/${endpoint}`;    
    
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
}