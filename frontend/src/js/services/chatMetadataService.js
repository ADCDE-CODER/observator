import { createChatMetadata, readChatMetadata } from "../api/chatMetadataApi";

export async function applyChatMetadata(chatMetadata, chatId, userToken) {
    for (const key in chatMetadata) {
        const value = chatMetadata[key];

        if (!value) {
            throw new Error(`${key} input value missing.`)
        }
    }

    if (!chatId) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    return await createChatMetadata(chatMetadata, chatId, userToken);
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