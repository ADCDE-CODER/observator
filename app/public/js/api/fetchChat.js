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

export { fetchChat };