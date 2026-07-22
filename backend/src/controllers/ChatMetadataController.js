export default class ChatMetadataController {
    constructor(ChatMetadataServiceInstance) {
        this.ChatMetadataService = ChatMetadataServiceInstance;
    }

    create(req, res) {
        const chatMetadata = req.body;
        const chatId = req.chat.id;

        try {
            this.ChatMetadataService.create(chatMetadata, chatId);
            res.status(201).json({message: "Chat metadata created successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
    
    read(req, res) {
        const chatId = req.chat.id;
        
        try {
            const metadata = this.ChatMetadataService.read(chatId);
            res.status(200).json({message: "Chat metadata read successfully", metadata}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    update(req, res) {
        const chatMetadata = req.body;
        const chatId = req.chat.id;
        
        try {
            const metadata = this.ChatMetadataService.update(chatMetadata, chatId);
            res.status(200).json({message: "Chat metadata updated successfully", metadata});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}