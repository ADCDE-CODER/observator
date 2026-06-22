import { createButton } from "../components/button";
import { createElement } from "../components/element";
import { createField } from "../components/field";
import { createInput } from "../components/input";
import { addChat, getChat, modifyChat, removeChat } from "../services/chatService";
import { saveChatSettings } from "../services/chatSettingsService";
import { createChatMenu, showActiveChatMenu } from "../components/chatMenu";
import { addMessages, getMessages } from "../services/messageService";
import { authState } from "../state/authState";

async function createChatPage(user) {
    const page = createElement({tagName: "section", options: {className: "content-main__page", id: "chat"}});

    if (!user) {
        const heading = createElement({tagName: "h2", options: {textContent: "No user"}});
        page.append(heading);
    } else {
        // Chat List
        const listOfChats = createElement({tagName: "aside", options: {id: "content-main__menuContent"}});

        const chats = await getChat(user);
        listOfChats.innerHTML = "";
        chats.forEach(chat => {
            const renameMenu = createButton({tagName: "a", textContext: "Rename", onClick: () => { 
                const title = prompt("Please enter to change chat title");
                if (title) {
                    modifyChat(user, chat.id, title);

                    const chatLink = document.getElementById(chat.id);
                    chatLink.firstChild.textContent = title;
                }
            }});

            const deleteMenu = createButton({tagName: "a", textContext: "Delete", onClick: () => { 
                if (confirm("Do you want delete chat and messages forever?")) {
                    removeChat(user, chat.id);

                    const chatLink = document.getElementById(chat.id);
                    chatLink.remove();
                }
            }});
            const chatLink = createChatMenu({tagName: "a", chat: chat, dropdownLists: {renameMenu, deleteMenu}, options: {className: "chatsMenu"}, onClick: async () => {
                showActiveChatMenu(chat.id, "chatsMenu");
                const messages = await getMessages(user, chat.id);

                const mainOutput = document.getElementById("content-main__output");
                mainOutput.innerHTML = "";
                messages.forEach( (chatMessage) => {
                    const chatParameter = document.createElement("p");
                    chatParameter.textContent = `${chatMessage.message}`;
                    mainOutput.appendChild(chatParameter);
                });
            }});
            listOfChats.appendChild(chatLink);
        });
        
        const newChatButton = createButton({tagName: "button", textContext: "New chat", options: {id: "chat-button"}, onClick: async () => {
            const chat = await addChat(user);
            const renameMenu = createButton({tagName: "a", textContext: "Rename", onClick: () => { 
                const title = prompt("Please enter to change chat title");
                if (title) {
                    modifyChat(user, chat.id, title);

                    const chatLink = document.getElementById(chat.id);
                    chatLink.firstChild.textContent = title;
                }
            }});

            const deleteMenu = createButton({tagName: "a", textContext: "Delete", onClick: () => { 
                if (confirm("Do you want delete chat and messages forever?")) {
                    removeChat(user, chat.id);

                    console.log(chat.id)
                    const chatLink = document.getElementById(chat.id);
                    chatLink.remove();
                }
            }});
            const chatLink = createChatMenu({tagName: "a", chat: chat, dropdownLists: {renameMenu, deleteMenu}, options: {className: "chatsMenu"}, onclick: async () => {
                showActiveChatMenu(chat.id, "chatsMenu");
                const messages = await getMessages(user, chat.id);
                
                const mainOutput = document.getElementById("content-main__output");
                mainOutput.innerHTML = "";
                messages.forEach( (chatMessage) => {
                    const chatParameter = document.createElement("p");
                    chatParameter.textContent = `${chatMessage.message}`;
                    mainOutput.appendChild(chatParameter);
                });
            }});

            listOfChats.appendChild(chatLink);
        }});

        const chatsHeading = createElement({tagName: "h2", options: {textContent: "Chats"}});
        const chatList = createElement({tagName: "div", options: {className: "content-main__chats"}});
        chatList.append(chatsHeading, newChatButton, listOfChats);

        // Chat Messages
        const chatOutput = createElement({tagName: "div", options: {id: "content-main__output"}});
        const promptCointainer = createElement({tagName: "div", options: {className: "content-main__button"}});
        const input = createInput({options: {id: "prompt-input", type: "text", placeholder: "Type here"}});
        const sendButton = createButton({tagName: "button", textContext: "Send", options: {id: "send-button"}, onClick: async () => {
            const userInput = document.getElementById("prompt-input");
            
            // Collect localStorage values
            const response = await addMessages(user, userInput.value, authState.token, authState.chatSettings, authState.selectedChatId);

            // Display user's message
            const userParameter = createElement({tagName: "p", options: {textContent: `${user.email}: ${userInput.value}`}});            
            const aiParameter = createElement({tagName: "p"});

            if (!response.error) {
                // Display AI's message
                aiParameter.innerText = response;
                
                // Clear user's input
                userInput.value = "";
            } else {
                aiParameter.innerText = response;
            }
            const mainOutput = document.getElementById("content-main__output");
            mainOutput.append(userParameter, aiParameter);
        }});
        promptCointainer.append(input, sendButton);

        const chatHeading = createElement({tagName: "h2", options: {textContent: "Chat"}});
        const chatMessages = createElement({tagName: "div", options: {className: "content-main__chat"}});
        chatMessages.append(chatHeading, chatOutput, promptCointainer);
            
        // Chat Settings
        const reasoning = createElement({tagName: "div", options: {className: "content-main__label"}});
        const ReasoningHeading = createElement({tagName: "h3", options: {textContent: "Reasoning"}});
        const effort = createField({tagName: "div", fieldObject: {type: "text", textContent: "Effort", id: "effort"}});
        const reasoningMaxTokens = createField({tagName: "div", fieldObject: {type: "number", textContent: "Max tokens", id: "reasoning-max-tokens"}});
        const exclude = createField({tagName: "div", fieldObject: {type: "checkbox", textContent: "Exclude", id: "exclude"}});
        reasoning.append(ReasoningHeading, effort, reasoningMaxTokens, exclude);

        const usage = createElement({tagName: "div", options: {className: "content-main__label"}});
        const UsageHeading = createElement({tagName: "h3", options: {textContent: "Usage"}});
        const include = createField({tagName: "div", fieldObject: {type: "checkbox", textContent: "Include", id: "include"}});
        usage.append(UsageHeading, include);

        const generally = createElement({tagName: "div", options: {className: "content-main__label"}});
        const GenerallyHeading = createElement({tagName: "h3", options: {textContent: "Generally"}});
        const stream = createField({tagName: "div", fieldObject: {type: "checkbox", textContent: "Stream", id: "stream"}});
        const maxTokens = createField({tagName: "div", fieldObject: {type: "number", textContent: "Max tokens", id: "max-tokens"}});
        const temperature = createField({tagName: "div", fieldObject: {type: "number", textContent: "Temperature", id: "temperature"}});
        const seed = createField({tagName: "div", fieldObject: {type: "number", textContent: "Seed", id: "seed"}});
        const topP = createField({tagName: "div", fieldObject: {type: "number", textContent: "Top-p", id: "top-p"}});
        const topK = createField({tagName: "div", fieldObject: {type: "number", textContent: "Top-k", id: "top-k"}});
        const frequencyPenalty = createField({tagName: "div", fieldObject: {type: "number", textContent: "Frequency penalty", id: "frequency-penalty"}});
        const presencePenalty = createField({tagName: "div", fieldObject: {type: "number", textContent: "Presence penalty", id: "presence-penalty"}});
        const repetitionPenalty = createField({tagName: "div", fieldObject: {type: "number", textContent: "Repetition penalty", id: "repetition-penalty"}});
        const logitBias = createField({tagName: "div", fieldObject: {type: "text", textContent: "Logit bias", id: "logit-bias"}});
        generally.append(GenerallyHeading, stream, maxTokens, temperature, seed, topP, topK, frequencyPenalty, presencePenalty, repetitionPenalty, logitBias);

        const applyButton = createButton({tagName: "button", textContext: "Apply", options: {type: "submit"}});
        
        const form = createElement({tagName: "form", options: {id: "chat-form__settings"}});
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            saveChatSettings(form);
        });
        form.append(reasoning, usage, generally, applyButton);

        const chatSettingsHeading = createElement({tagName: "h2", options: {textContent: "Settings"}});
        const chatSettings = createElement({tagName: "div", options: {className: "content-main__settings"}});
        chatSettings.append(chatSettingsHeading, form);
        
        page.append(chatList, chatMessages, chatSettings);
    }

    return page;
}

export { createChatPage };