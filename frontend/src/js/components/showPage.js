import { updateNavbarUI } from "./updateNavbarUI.js";

function showPage(id, storeHistory) {
    const pages = document.getElementsByClassName("content-main__page");
    
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        if (page.id == id) {
            page.style.display = "flex";   
        } else {
            page.style.display = "none";
        }
    }
    
    if (storeHistory) {
        history.pushState({ page: id }, "", "");
    }

    updateNavbarUI();
};

export { showPage };