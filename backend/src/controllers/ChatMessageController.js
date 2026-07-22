export default class ChatMessageController {
    constructor(UserChatMessageServiceInstance, AssistantChatMessageServiceInstance, chatMetadataServiceInstance, AIGenerationServiceInstance) {
        this.UserChatMessageService = UserChatMessageServiceInstance;
        this.AssistantChatMessageService = AssistantChatMessageServiceInstance;
        this.chatMetadataService = chatMetadataServiceInstance;
        this.AIGenerationService = AIGenerationServiceInstance;
    }

    async create(req, res) {
        const { content, images } = req.body;
        const chatId = req.chat.id;
        const userRole = "user";
        const assistantRole = "assistant";

        // Reads chat history and builds the context array.
        let chatHistory = [];

        try {
            const userMessages = this.UserChatMessageService.getAll(chatId);
            const assistantMessages = this.AssistantChatMessageService.getAll(chatId);

            const allMessages = [
                ...userMessages.map(message => ({
                    ...message
                })),
    
                ...assistantMessages.map(message => ({
                    ...message
                }))
            ];

            // Sort by created at 
            allMessages.sort((a, b) => a.created_at - b.created_at);

            // Push all messages to chatHistory
            chatHistory.push(...allMessages);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }

        // Load all chat history from database and store all in conversation contexts 
        let conversationContext = [];

        try {
            if (chatHistory && chatHistory.length > 0) {
                chatHistory.forEach(message => {
                    if(typeof message.images !== null) {
                        conversationContext.push({ role: message.role, thinking: message.thinking, content: message.content, images: message.images });
                    } else {
                        conversationContext.push({ role: message.role, thinking: message.thinking, content: message.content });
                    }
                });
            }

            // Store new user content in conversation context
            if(typeof content === null) {
                const error = new Error("Context is required");
                error.status = 400;
                throw error;
            }
            
            // New user content
            if(typeof images !== null) {
                conversationContext.push({role: userRole, content: content, images: images});
            } else {
                conversationContext.push({role: userRole, content: content});
            }
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }

        // Get chat metadata
        let chatMetadata = [];

        try {
            chatMetadata = this.chatMetadataService.read(chatId);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message});
        }

        // Get streaming from AI
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            let stream = null;
            let inThinking = false
            let fullAssistantThinking = "";
            let fullAssistantContent = "";

            try {
                stream = await this.AIGenerationService.generateResponse(conversationContext, chatMetadata);
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message});
            }

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

                    payload = { type: "thinking", text: chunk.message.thinking };
                    fullAssistantThinking += chunk.message.thinking;
                } else if (chunk.message.content) {
                    if(inThinking) {
                        inThinking = false;
                    }

                    payload = { type: "content", text: chunk.message.content };
                    fullAssistantContent += chunk.message.content;
                }

                if (payload.type) {
                    res.write(`data: ${JSON.stringify(payload)}\n\n`)
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
                this.UserChatMessageService.create({ role: userRole, content, images }, chatId);
                this.AssistantChatMessageService.create({ role: assistantRole, thinking: fullAssistantThinking, content: fullAssistantContent }, chatId);
                
                console.log("User and assistant message saved successfully.");
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message});
            }
        }
    };
    
    getAll(req, res) {
        const chatId = req.chat.id;
        
        try {
            const chatMessages = this.UserChatMessageService.getAll(chatId);
            res.status(200).json({message: "Chat message read successfully", chatMessages}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    update(req, res) {
        const chatMessageData = req.body;
        const chatId = req.chat.id;
        const chatMessageId = req.chatMessage.id;
        
        try {
            const chatMessage = this.UserChatMessageService.update(chatMessageData, chatMessageId, chatId);
            res.status(200).json({message: "Chat message updated successfully", chatMessage});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    delete(req, res) {
        const chatId = req.chat.id;
        const chatMessageId = req.chatMessage.id;
        
        try {
            this.UserChatMessageService.delete(chatMessageId, chatId);
            res.status(200).json({message: "Chat message deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}