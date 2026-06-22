import logoImg from "./../../assets/images/logo.png"
import profileImg from "./../../assets/images/profile.png"
import { createImage } from "../components/image.js";
import { createButton } from "../components/button";
import { showPage } from "./showPage.js";
import { createNavbar } from "../components/navbar";
import { authState } from "../state/authState.js";
import { createElement } from "../components/element.js";

function renderNavbarPage(user) {
    const logo = createImage({src: logoImg, alt: "logo image", options: {id: "logo"}});
    const logoDiv = createElement({tagName: "div", options: {id: "nav-header__logo"}});
    logoDiv.append(logo);
    
    // Handle logo click
    logo.addEventListener("click", () => {
        showPage("welcome", false)
    });
    
    const lists = {
        logo: logo,
        menu: null,
        profile: null,
        logout: null,
        login: null
    };
    const options = {
        navCointainerClassName: "nav-header__content",
        navId: "nav-header__menu"
    };
    
    if (!user) {
        // Handle log in click
        const loginButton = createButton({tagName: "button", textContext: "Log in", options: {id: "loginMenu-button"}, onClick: () => {
            showPage("sign-menu", true);
        }});

        lists.login = loginButton;
    } else {
        const profile = createImage({src: profileImg, alt: "profile image", options: {id: "profile"}});
        const profileDiv = createElement({tagName: "div", options: {id: "nav-header__profile"}});
        profileDiv.append(profile);

        // Handle log out click
        const logoutButton = createButton({tagName: "button", textContext: "Log out", options: {id: "logoutMenu-button"}, onClick: () => {
            authState.clearAllLocalStorage();
            authState.notification();
        }});

        // Handle navigation links
        const chatLink = createButton({tagName: "a", textContext: "Chat", onClick: (event) => {
            event.preventDefault();
            showPage("chat", true);
        }});
        const imageLink = createButton({tagName: "a", textContext: "Image", onClick: (event) => {
            event.preventDefault();
            showPage("image", true);
        }});
        const videoLink = createButton({tagName: "a", textContext: "Video", onClick: (event) => {
            event.preventDefault();
            showPage("video", true);
        }});
        const postLink = createButton({tagName: "a", textContext: "Post", onClick: (event) => {
            event.preventDefault();
            showPage("post", true);
        }});
        
        lists.menu = [chatLink, imageLink, videoLink, postLink];
        lists.profile = profile;
        lists.logout = logoutButton;
    }

    console.log({...localStorage});

    const navbar = createNavbar({lists, options});
    return navbar;
}

export { renderNavbarPage };