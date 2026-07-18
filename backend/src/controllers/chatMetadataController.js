export default class ChatMetadataController {
    constructor(ChatMetadataServiceInstance) {
        this.ChatMetadataService = ChatMetadataServiceInstance;
    }

    create(req, res) {
        const chatMetadata = req.body;

        try {
            this.ChatMetadataService.create(chatMetadata);
            res.status(201).json({message: "Chat metadata created successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
    
    read(req, res) {
        const { chat_id } = req.body;
        
        try {
            const metadata = this.ChatMetadataService.read(chat_id);
            res.status(200).json({message: "Chat metadata read successfully", metadata}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    update(req, res) {
        const chatMetadata = req.body;
        
        try {
            const metadata = this.ChatMetadataService.update(chatMetadata);
            res.status(200).json({message: "Chat metadata updated successfully", metadata});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}