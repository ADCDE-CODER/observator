const signMenu = document.getElementById("sign-menu");
const contentMain = document.getElementById("content-main");

const logoButton = document.getElementById("nav-header__logo");

logoButton.addEventListener("click", () => {
    signMenu.style.display = "none";
    contentMain.style.display = "block";
});

const loginMenuButton = document.getElementById("loginMenu-button");

loginMenuButton.addEventListener("click", () => {
    signMenu.style.display = "block";
    contentMain.style.display = "none";
}); 

const navHeader = document.getElementById("nav-header");
const signUpButton = document.getElementById("signup-button");

signUpButton.addEventListener("click", async () => {
    const email = document.getElementById("create-email").value;
    const password = document.getElementById("create-password").value;

    console.log("Email: " + email + " and password: " + password);
});

let isNewChat = false;

const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", async () => {
    const input = document.getElementById("prompt-input").value;
    
    if (!isNewChat) {
        const menuContent = document.getElementById("content-main__menuContent");
        const para2 = document.createElement("p");
        para2. innerText = input;
        menuContent.appendChild(para2);
        isNewChat = true;
    }

    const output = document.getElementsByClassName("content-main__output")[0];
    const paraInput = document.createElement("p");
    paraInput.innerText = input;
    output.appendChild(paraInput);

    const response = await fetch("http://localhost:3000/prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({prompt: input})
    });

    const para = document.createElement("p");
    const result = await response.json();
    para.innerText = result;
    output.appendChild(para);
});