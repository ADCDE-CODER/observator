import { requestApi } from "./requestApi.js";

async function createChat(user) {
    const data = {
        user: user
    };

    return requestApi("http://localhost:3000/chat/new", "POST", null, data, "New chat error:");
};

async function fetchChat(user) {
    const data = {
        user: user
    };

    return requestApi("http://localhost:3000/chat/one", "POST", null, data, "Get chat error:");
};

async function updateChat(user, chatId, title) {
    const data = {
        user: user,
        chatId: chatId,
        title: title
    };

    return requestApi("http://localhost:3000/chat/update", "POST", null, data, "Update chat error:");
};

async function deleteChat(user, chatId) {
    const data = {
        user: user,
        chatId: chatId
    };

    return requestApi("http://localhost:3000/chat/delete", "POST", null, data, "Delete chat error:");
};

export { createChat, fetchChat, updateChat, deleteChat };