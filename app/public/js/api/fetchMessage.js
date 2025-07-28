async function fetchMessage(chatId) {
    try {
        const response = await fetch("http://localhost:3000/message/one", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                data: { 
                    chatId: chatId 
                }
            })
        });

        const result = await response.json();

        return {ok: response.ok, status: response.status, ...result};
    } catch (error) {
        return {ok: false, status: 0, success: false, error: `Failed to load chat messages: ${error.message}`};
    }
};

export { fetchMessage };