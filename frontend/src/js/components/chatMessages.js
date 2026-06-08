function renderChatMessages(chatMessages) {
    if (chatMessages) {
        const mainOutput = document.getElementById("content-main__output");
        if (mainOutput) {
            mainOutput.innerHTML = "";
            chatMessages.forEach( (chatMessage) => {
                const chatParameter = document.createElement("p");
                chatParameter.textContent = `${chatMessage.message}`;
                mainOutput.appendChild(chatParameter);
            });
        } else {
            console.log(`Main output is ${mainOutput}`);
        }
    } else {
        console.log(`Chat messages is ${chatMessages}`);
    }
};

export { renderChatMessages };