export default class ChatMetadataController {
    constructor(chatMetadataService) {
        this.chatMetadataService = chatMetadataService;
    }
    
    async getChatMetadata(req, res) {
        const chatId = req.chat.id;
        
        try {
            const metadata = await this.chatMetadataService.getChatMetadata(chatId);
            res.status(200).json({message: "Chat metadata read successfully", metadata}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    }

    async updateProvider(req, res) {
        const provider = req.body;
        const chatId = req.chat.id;
        
        try {
            const metadata = await this.chatMetadataService.updateProvider(provider, chatId);
            res.status(200).json({message: 'The provider updated successfully', metadata}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    }

    async updateModel(req, res) {
        const model = req.body;
        const chatId = req.chat.id;

        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
        
            try {
                const metadata = await this.chatMetadataService.updateModel(model, chatId, (progress) => {
                    res.write(`event: progress\n` + `data: ${JSON.stringify(progress)}\n\n`);
                });
                
                res.write(`event: complete\n` + `data: ${JSON.stringify({ message: 'The model updated successfully', metadata })}\n\n`);
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

    updateConfig(req, res) {
        const config = req.body;
        const chatId = req.chat.id;
        
        try {
            const metadata = this.chatMetadataService.updateConfig(config, chatId);
            res.status(200).json({message: 'The config updated successfully', metadata}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
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