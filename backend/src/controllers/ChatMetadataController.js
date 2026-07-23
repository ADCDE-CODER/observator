export default class ChatMetadataController {
    constructor(chatMetadataService) {
        this.chatMetadataService = chatMetadataService;
    }

    create(req, res) {
        const chatMetadata = req.body;
        const chatId = req.chat.id;

        try {
            this.chatMetadataService.create(chatMetadata, chatId);
            res.status(201).json({message: "Chat metadata created successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
    
    getById(req, res) {
        const chatId = req.chat.id;
        
        try {
            const metadata = this.chatMetadataService.getById(chatId);
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
            const metadata = this.chatMetadataService.update(chatMetadata, chatId);
            res.status(200).json({message: "Chat metadata updated successfully", metadata});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}