import { updateProviderChatMetadata, updateModelChatMetadata, updateConfigChatMetadata, readChatMetadata, resetChatMetadata } from "../api/chatMetadataApi";

export async function getChatMetadata(chatId, userToken) {
    if (!chatId) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    return await readChatMetadata(chatId, userToken);
};

export async function applyProvider(provider, chatId, userToken) {
    if (!provider.value) {
        throw new Error("Provider input value missing.")
    }
    
    if (!chatId) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    return await updateProviderChatMetadata(provider, chatId, userToken);
};

export async function applyModel(model, chatId, userToken, onChunk) {
    if (!model.value.selectModel) {
        throw new Error("Select model input value missing.");
    }
    
    if (!chatId) {
        throw new Error("Chat ID missing.");
    }

    if (!userToken) {
        throw new Error("User token missing.");
    }

    await updateModelChatMetadata(model, chatId, userToken, onChunk);
};

export async function applyConfig(config, chatId, userToken) {
    for (const key in config.value) {
        const value = config.value[key];

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

    return await updateConfigChatMetadata(config, chatId, userToken);
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