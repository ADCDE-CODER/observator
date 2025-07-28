async function createMessage(token, userInputValue, chatSettings, chatId) {
    try {
        const response = await fetch("http://localhost:3000/message/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                data: { 
                    userInput: userInputValue, 
                    settings: chatSettings, 
                    chatId: chatId 
                }
            })
        });
        
        const result = await response.json();

        return {ok: response.ok, status: response.status, ...result};
    } catch (error) {
        return {ok: false, status: 0, success: false, error: `Chat prompt error: ${error.message}`};
    }
};

export { createMessage };