import { clearLocalStorage, loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

const listeners = [];

const authState = {
    user: null,
    token: null,
    chatSettings: null,
    selectedChatId: null,

    subscribers(callback) {
        listeners.push(callback);
    },

    notification() {
        listeners.forEach((callback) => {
            callback();
        }) 
    },

    setUser(user) {
        this.user = user;
        saveToLocalStorage("USER", user);
    },

    setToken(token) {
        this.token = token;
        saveToLocalStorage("TOKEN", token);
    },

    setChatSettings(chatSettings) {
        this.chatSettings = chatSettings;
        saveToLocalStorage("CHATS_SETTINGS", chatSettings);
    },

    setSelectedChatId(selectedChatId) {
        this.selectedChatId = selectedChatId;
        saveToLocalStorage("SELECTED_CHAT_ID", selectedChatId);
    },

    loadLocalStorage() {
        this.user = loadFromLocalStorage("USER");
        this.token = loadFromLocalStorage("TOKEN");
        this.chatSettings = loadFromLocalStorage("CHATS_SETTINGS");
        this.selectedChatId = loadFromLocalStorage("SELECTED_CHAT_ID");
    },

    clearAllLocalStorage() {
        clearLocalStorage();
        this.user = null;
        this.token = null;
        this.chatSettings = null;
        this.selectedChatId = null;
    }
};

export { authState };