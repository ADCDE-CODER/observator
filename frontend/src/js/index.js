import "./../assets/styles/styles.css"
import logoImg from "./../assets/images/logo.png"
import profileImg from "./../assets/images/profile.png"
import { initUserSession } from "./services/userService.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("logo").src = logoImg;
    document.getElementById("profile").src = profileImg;

    initUserSession();
});