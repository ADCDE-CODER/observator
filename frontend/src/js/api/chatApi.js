export async function createChat(title, userToken) {
    const url = "/api/chats/";    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ title })
    });
    
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }

    return result;
};

export async function getAllChats(userToken) {
    const url = "/api/chats/";    
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

export async function updateChat(title, id, userToken) {
    const url = `/api/chats/${id}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ title })
    });
    
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }

    return result;
};

export async function deleteChat(id, userToken) {
    const url = `/api/chats/${id}`;   
    const response = await fetch(url, {
        method: "DELETE",
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