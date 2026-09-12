export default class ChatMetadataController {
    constructor(chatMetadataService) {
        this.chatMetadataService = chatMetadataService;
    }
    
    async getChatSettings(req, res) {
        const chatId = req.chat.id;
        
        try {
            const metadata = await this.chatMetadataService.getChatSettings(chatId);
            res.status(200).json({message: "Chat metadata read successfully", metadata}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    }

    async update(req, res) {
        const chatMetadata = req.body;
        const chatId = req.chat.id;
        
        try {
            const metadata = await this.chatMetadataService.update(chatMetadata, chatId);
            res.status(200).json({message: "Chat metadata updated successfully", metadata});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    }
}