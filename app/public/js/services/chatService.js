import { loadFromLocalStorage } from "../utils/localStorage.js";
import { createChat } from "../api/createChat.js";
import { fetchChat } from "../api/fetchChat.js";
import { renderChatList } from "../components/chatList.js";

async function createChatAndReloadMenu() {
    const user = loadFromLocalStorage("user");
    const result = await createChat(user);

    if (result.ok && result.success) {
        await loadChatMenu();
        alert(result.message);
    } else {
        alert(`${result.error} (status: ${result.status})`);
    }
};

async function loadChatMenu() {
    const user = loadFromLocalStorage("user");
    const chatMenuContent = document.getElementById("content-main__menuContent");

    if (user) {
        const result = await fetchChat(user);

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

export { createChatAndReloadMenu, loadChatMenu };