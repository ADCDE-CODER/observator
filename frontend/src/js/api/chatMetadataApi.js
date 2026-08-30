export async function createChatMetadata(chatMetadata, chatId, userToken) {
    const url = `/api/chats/${chatId}/chatMetadata`;    
    
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(chatMetadata)
    });
    
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }
    
    return result;
};

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