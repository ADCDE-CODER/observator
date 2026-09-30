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
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
        
            try {
                const metadata = await this.chatMetadataService.update(chatMetadata, chatId, (progress) => {
                    res.write(`event: progress\n` + `data: ${JSON.stringify(progress)}\n\n`);
                });
                
                res.write(`event: complete\n` + `data: ${JSON.stringify({ message: 'Chat metadata updated successfully', metadata })}\n\n`);
                res.end();
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message})
            }
        } catch (error) {
            console.error(error);
            
            if (!res.headersSent) {                 
                res.status(error.status || 500).json({message: error.message})
            }
        }
    }

    async resetProvider(req, res) {
        try {
            const metadata = await this.chatMetadataService.resetProvider();
            res.status(200).json({message: "The provider has been restored", metadata}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }
    }

    async resetModel(req, res) {
        try {
            const metadata = await this.chatMetadataService.resetModel();
            res.status(200).json({message: "The model has been restored", metadata}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }
    }

    resetConfig(req, res) {
        try {
            const metadata = this.chatMetadataService.resetConfig();
            res.status(200).json({message: "The config has been restored", metadata}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }
    }
}