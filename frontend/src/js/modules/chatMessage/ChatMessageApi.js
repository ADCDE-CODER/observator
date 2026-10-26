import BaseAPI from "../BaseApi.js";

export default class ChatMessageAPI extends BaseAPI {
    constructor(token) {
        super("/api/chats", { token });
    }

    async sendMessage(chatId, userChatMessage, onChunk) {
        const url = `${this.baseUrl}/${chatId}/chatmessages`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify(userChatMessage),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        if (!reader) {
            throw new Error("Response body is not a stream");
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
    }

    async getMessages(chatId) {
        return await this.request(`/${chatId}/chatMessages`, { method: "GET" });
    }
}