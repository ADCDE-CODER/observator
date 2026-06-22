import { createChat, readChat, updateChat, deleteChat } from "../api/chatApi.js";

async function addChat(user) {
    if (user) {
        const result = await createChat(user);

        if (result.ok && result.success) {
            alert(result.message);
            return result.lastChatItem;
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }
    } else {
        alert("No user found!");
    }
};

async function getChat(user) {
    if (user) {
        const result = await readChat(user);

        if (result.ok && result.success) {
            console.log(result.message);
            return result.chats;
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }
    } else {
        alert("No user found!");
    }
};

async function modifyChat(user, chatId, title) {
    if (user) {
        const result = await updateChat(user, chatId, title);

        if (result.ok && result.success) {
            alert(result.message);
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }
    } else {
        alert("No user found!");
    }
};

async function removeChat(user, chatId) {
    if (user) {
        const result = await deleteChat(user, chatId);

        if (result.ok && result.success) {
            alert(result.message);
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }
    } else {
        alert("No user found!");
    }
};

export { addChat, getChat, modifyChat, removeChat };