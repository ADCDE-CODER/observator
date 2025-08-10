import { loadFromLocalStorage } from "../utils/localStorage.js";
import { createChat, getChat, updateChat, deleteChat } from "../api/chatApi.js";
import { renderChatList } from "../components/chatList.js";

async function createChatAndReloadMenu() {
    const user = loadFromLocalStorage("user");
    if (user) {
        const result = await createChat(user);

        if (result.ok && result.success) {
            renderChatList(result.lastChatItem);
            alert(result.message);
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }
    } else {
        alert("No user found!");
    }
};

async function loadChatMenu() {
    const user = loadFromLocalStorage("user");
    const chatMenuContent = document.getElementById("content-main__menuContent");

    if (user) {
        const result = await getChat(user);

        if (result.ok && result.success) {
            renderChatList(result.chats);
            console.log(result.message);
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }

    } else {
        chatMenuContent.innerHTML = "";
    }
};

async function updateChatMenu(chatId, title) {
    const user = loadFromLocalStorage("user");
    if (user) {
        const result = await updateChat(user, chatId, title);

        if (result.ok && result.success) {
            loadChatMenu();
            alert(result.message);
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }

    } else {
        alert("No user found!");
    }
};

async function deleteChatMenu(chatId) {
    const user = loadFromLocalStorage("user");
    if (user) {
        const result = await deleteChat(user, chatId);

        if (result.ok && result.success) {
            loadChatMenu();
            alert(result.message);
        } else {
            alert(`${result.error} (status: ${result.status})`);
        }

    } else {
        alert("No user found!");
    }
};

export { createChatAndReloadMenu, loadChatMenu, updateChatMenu, deleteChatMenu };