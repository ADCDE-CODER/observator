export default class ChatMessageController {
    constructor(userChatMessageService, assistantChatMessageService, chatMetadataService, aiGenerationService) {
        this.userChatMessageService = userChatMessageService;
        this.assistantChatMessageService = assistantChatMessageService;
        this.chatMetadataService = chatMetadataService;
        this.aiGenerationService = aiGenerationService;
    }

    #sortChatMessagesByCreatedAt(userMessages, assistantMessages, direction = "asc") {
        const chatMessages = [
            ...userMessages,
            ...assistantMessages
        ];

        // Sort by created at 
        return chatMessages.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);

            if (direction === "asc") {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
    }

    #getChatMessages(req, res) {
        const chatId = req.chat.id;

        try {
            const userMessages = this.userChatMessageService.getAll(chatId);
            const assistantMessages = this.assistantChatMessageService.getAll(chatId);
            const chatMessages = this.#sortChatMessagesByCreatedAt(userMessages, assistantMessages);

            return chatMessages;
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    }

    async create(req, res) {
        const userChatMessage = req.body;
        const chatId = req.chat.id;

        const chatMessages = this.#getChatMessages(req, res);

        // Get only role, content, and images
        const conversationContext = chatMessages.map(({role, content, images}) => {
            return {role, content, images};
        });
        conversationContext.push({role: userChatMessage.role, content: userChatMessage.content, images: userChatMessage.images});

        // Initialize the property as an empty string prevent undefined
        let assistantChatMessage = {
            thinking: "",
            content: ""
        };
        
        // Get streaming from AI
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            let stream = null;

            try {
                const chatMetadata = this.chatMetadataService.getById(chatId);
                stream = await this.aiGenerationService.generateResponse(conversationContext, chatMetadata);
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message});
            }

            let inThinking = false

            // Stream the content chunk by chunk
            for await (const chunk of stream) {
                if (!chunk || !chunk.message) {
                    continue;
                }

                let payload = {};

                if(chunk.message.thinking) {
                    if(!inThinking) {
                        inThinking = true;
                    }

                    payload = { model: chunk.model, type: "thinking", text: chunk.message.thinking };
                    assistantChatMessage.thinking += chunk.message.thinking;
                } else if (chunk.message.content) {
                    if(inThinking) {
                        inThinking = false;
                    }

                    payload = { model: chunk.model, type: "content", text: chunk.message.content };
                    assistantChatMessage.content += chunk.message.content;
                }

                if (payload.type) {
                    res.write(`data: ${JSON.stringify(payload)}\n\n`);
                }

                if (chunk.done) {
                    assistantChatMessage.role = chunk.message.role;
                    assistantChatMessage.model = chunk.model;
                    assistantChatMessage.createdAt = chunk.created_at
                }
            }
            
            // End response when streaming is complete. 
            res.end();
        } catch (error) {
            console.error(error);
            
            if (!res.headersSent) {                 
                res.status(error.status || 500).json({message: error.message})
            }
        } finally {
            console.log("Attempting to save data...");
            
            try {
                this.userChatMessageService.create(userChatMessage, chatId);
                this.assistantChatMessageService.create(assistantChatMessage, chatId);
                
                console.log("User and assistant message saved successfully.");
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message});
            }
        }
    };
    
    getAll(req, res) {
        const chatMessages = this.#getChatMessages(req, res);
        res.status(200).json({message: "Chat message read successfully", chatMessages}); 
    };

    update(req, res) {
        const chatMessageData = req.body;
        const chatId = req.chat.id;
        const userChatMessageId = req.userChatMessage.id;
        const assistantChatMessageId = req.assistantChatMessage.id;
        
        try {
            const chatMessage = this.userChatMessageService.update(chatMessageData, userChatMessageId, chatId);
            res.status(200).json({message: "Chat message updated successfully", chatMessage});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    delete(req, res) {
        const chatId = req.chat.id;
        const userChatMessageId = req.userChatMessage.id;
        const assistantChatMessageId = req.assistantChatMessage.id;
        
        try {
            this.userChatMessageService.delete(userChatMessageId, chatId);
            res.status(200).json({message: "Chat message deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}