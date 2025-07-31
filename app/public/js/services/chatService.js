import { loadFromLocalStorage } from "../utils/localStorage.js";
import { createChat, fetchChat } from "../api/chatApi.js";
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