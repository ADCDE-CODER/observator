import { createChatMetadata, readChatMetadata, resetChatMetadata } from "../api/chatMetadataApi";

export async function applyChatMetadata(chatMetadata, chatId, userToken, onChunk) {
    if (!chatId) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    await createChatMetadata(chatMetadata, chatId, userToken, onChunk);
};

export async function getChatMetadata(chatId, userToken) {
    if (!chatId) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    return await readChatMetadata(chatId, userToken);
};

export async function restartChatMetadata(endpoint, chatId, userToken) {
    if (!chatId) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    return await resetChatMetadata(endpoint, chatId, userToken);
};