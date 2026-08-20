import { createChat, getAllChats, updateChat, deleteChat } from "../api/chatApi.js";

export async function addChat(title, userToken) {
    if (!userToken) {
        throw new Error("User token missing.");
    }

    return await createChat(title, userToken);
};

export async function getChats(userToken) {
    if (!userToken) {
        throw new Error("User token missing.");
    }

    return await getAllChats(userToken);
};

export async function modifyChat(title, id, userToken) {
    if (!title.trim()) {
        throw new Error("Please enter a text to change the chat title.");
    }

    if (!id) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    return await updateChat(title, id, userToken);
};

export async function removeChat(id, userToken) {
    if (!id) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    return await deleteChat(id, userToken);
};