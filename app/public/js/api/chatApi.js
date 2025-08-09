async function createChat(user) {
    try {
        const response = await fetch("http://localhost:3000/chat/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                data: { 
                    user: user 
                }
            })
        });

        const result = await response.json();

        return {ok: response.ok, status: response.status, ...result};
    } catch (error) {
        return {ok: false, status: 0, success: false, error: `New chat error: ${error.message}`};
    }
};

async function fetchChat(user) {
    try {
        const response = await fetch("http://localhost:3000/chat/one", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                data: { 
                    user: user 
                }
            })
        });

        const result = await response.json();

        return {ok: response.ok, status: response.status, ...result};
    } catch (error) {
        return {ok: false, status: 0, success: false, error: `Get chat error: ${error.message}`};
    }  
};

async function updateChat(user, chatId, title) {
    try {
        const response = await fetch("http://localhost:3000/chat/update", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                data: { 
                    user: user,
                    chatId: chatId,
                    title: title
                }
            })
        });

        const result = await response.json();

        return {ok: response.ok, status: response.status, ...result};
    } catch (error) {
        return {ok: false, status: 0, success: false, error: `Update chat error: ${error.message}`};
    }  
};

async function deleteChat(user, chatId) {
    try {
        const response = await fetch("http://localhost:3000/chat/delete", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                data: { 
                    user: user,
                    chatId: chatId
                }
            })
        });

        const result = await response.json();

        return {ok: response.ok, status: response.status, ...result};
    } catch (error) {
        return {ok: false, status: 0, success: false, error: `Delete chat error: ${error.message}`};
    }  
};

export { createChat, fetchChat, updateChat, deleteChat };