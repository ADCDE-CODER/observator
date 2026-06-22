import { authState } from "../state/authState.js";

function saveChatSettings(form) {
    const chatSettings = {};
    Array.from(form.elements).forEach( (element) => {
        if (!element) {
            return;
        } else {
            if (element.type === "checkbox") {
                chatSettings[element.name] = element.checked;
            } else {
                if ( element.type === "number") {
                    const parseNumber = parseFloat(element.value)

                    if (isNaN(parseNumber)) {
                        chatSettings[element.name] = null;
                    } else {
                        chatSettings[element.name] = parseNumber;
                    }
                } else {
                    const value = element.value;

                    if (value === "") {
                        chatSettings[element.name] = null;
                    } else {
                        chatSettings[element.name] = value;
                    }
                }
            }
        }
    });

    authState.setChatSettings(chatSettings);
    console.log("Data: ", chatSettings);
};

export { saveChatSettings };