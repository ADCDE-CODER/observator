import { createButton } from "./button.js";
import { createElement } from "./element.js";

function createChatDropdown({lists = {}}) {
    const chatDropdown = createElement({tagName: "div", options: {id: "chat-dropdown"}});
    const content = createElement({tagName: "div", options: {id: "chat-dropdown__content"}});
    content.style.display = "none";
    
    // Listning for a dropdown button is pressed to show a dropdown 
    const contentButton = createButton({tagName: "button", textContext: "...", options: {id: "chat-dropdown__button"}, onClick: (event) => {
        event.stopPropagation();
        if (content.style.display === "none") {
            content.style.display = "flex";
        } else {
            content.style.display = "none";
        }
    }});

    // Listning for when cursor is pressed outside of dropdown element, then hide a dropdown
    document.addEventListener("click", (event) => {
        if (!content.contains(event.target) && !contentButton.contains(event.target)) {
            content.style.display = "none";
        }
    });

    Object.keys(lists).forEach(key => {
        const value = lists[key];
        if (value instanceof Node) {
            content.appendChild(value);
            return;
        }
    });
    
    chatDropdown.append(contentButton, content);

    return chatDropdown;
};

export { createChatDropdown };