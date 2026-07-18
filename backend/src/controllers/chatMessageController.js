export class ChatMessageController {
    constructor(UserChatMessageServiceInstance, AIChatMessageServiceInstance, chatMetadataServiceInstance, AIGenerationServiceInstance) {
        this.UserChatMessageService = UserChatMessageServiceInstance;
        this.AIChatMessageService = AIChatMessageServiceInstance;
        this.chatMetadataService = chatMetadataServiceInstance;
        this.AIGenerationService = AIGenerationServiceInstance;
    }

    create(req, res) {
        const { content, images, chat_id } = req.body;
        const userRole = "user";
        const assistantRole = "assistant";

        // Reads chat history and builds the context array.
        let chatHistory = [];

        try {
            const userMessages = this.UserChatMessageService.read(chat_id);
            const assistantMessages = this.AIChatMessageService.read(chat_id);

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
            chatMetadata = this.chatMetadataService.read(chat_id);
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
                stream = await this.AIGenerationService.streamResponse(conversationContext, chatMetadata);
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
                this.UserChatMessageService.create({ role: userRole, content, images, chat_id });
                this.AIChatMessageService.create({ role: assistantRole, thinking: fullAssistantThinking, content: fullAssistantContent, chat_id });
                
                console.log("User and assistant message saved successfully.");
            } catch (error) {
                console.error(error);
                res.status(error.status || 500).json({message: error.message});
            }
        }
    };
    
    read(req, res) {
        const { chat_id } = req.body;
        
        try {
            const chatMessages = this.UserChatMessageService.read(chat_id);
            res.status(200).json({message: "Chat message read successfully", chatMessages}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    update(req, res) {
        const { role, content, images, id, chat_id } = req.body;
        
        try {
            const chatMessage = this.UserChatMessageService.update({ role, content, images, id, chat_id });
            res.status(200).json({message: "Chat message updated successfully", chatMessage});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    delete(req, res) {
        const { id, chat_id } = req.body;
        
        try {
            this.UserChatMessageService.delete(id, chat_id);
            res.status(200).json({message: "Chat message deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}