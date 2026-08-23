import { reactive } from "vue";
import { clearLocalStorage, loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

export const authState = reactive ({
    user: null,
    token: null,
    selectedChatId: null,
    
    setUser(user) {
        this.user = user;
        saveToLocalStorage("USER", user);
    },
    
    setToken(token) {
        this.token = token;
        saveToLocalStorage("TOKEN", token);
    },
    
    setSelectedChatId(selectedChatId) {
        this.selectedChatId = selectedChatId;
        saveToLocalStorage("SELECTED_CHAT_ID", selectedChatId);
    },
    
    loadLocalStorage() {
        this.user = loadFromLocalStorage("USER");
        this.token = loadFromLocalStorage("TOKEN");
        this.selectedChatId = loadFromLocalStorage("SELECTED_CHAT_ID");
    },
    
    clearAllLocalStorage() {
        clearLocalStorage();
        this.user = null;
        this.token = null;
        this.selectedChatId = null;
    }
});