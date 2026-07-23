export default class ChatMetadataService {
    constructor(chatMetadataModel) {
        this.chatMetadataModel = chatMetadataModel;
        this.keys = ['provider', 'model', 'system_content', 'think', 'temperature', 'top_k', 'top_p', 'min_p', 'context', 'predict'];
    }
    
    getById(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required to read chat metadata.");
        }

        try {            
            const chatMetadata = this.chatMetadataModel.findById(chatId);

            if (!chatMetadata) {
                throw new Error("No chat metadata found.");
            }

            return chatMetadata;
        } catch (error) {
            throw error;
        }
    };
    
    update(chatMetadata, chatId) {
        const { provider, model } = chatMetadata; 
        
        if (!provider || !model) {
            const error = new Error("Provider and model are required to update a chat metadata.");
            error.status = 400;
            throw error;
        }
        
        if (!chatId) {
            throw new Error("Chat ID is required to update a chat metadata.");
        }

        let columns = "";
        let validValues = [];
        
        // Ensure casing matches DB schema strictly (snake_case)
        this.keys.forEach(key => {
            const value = chatMetadata[key];
            if (!value) return;

            columns += `${key} = ?, `;
            validValues.push(value);
        });

        // Remove space and comma
        columns = columns.slice(0, -2);

        try {
            const metadata = this.chatMetadataModel.update(columns, validValues, chatId);

            if(!metadata) {
                throw new Error("Update failed.");
            }

            return metadata;
        } catch (error) {
            throw error;
        }
    };
}