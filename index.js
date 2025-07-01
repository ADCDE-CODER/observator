const logoButton = document.getElementById("nav-header__logo");
const loginMenuButton = document.getElementById("loginMenu-button");
const sendButton = document.getElementById("send-button");

const loginContent = document.getElementById("login-content");
const contentMain = document.getElementById("content-main");

logoButton.addEventListener("click", () => {
    loginContent.style.display = "none";
    contentMain.style.display = "block";
});

loginMenuButton.addEventListener("click", () => {
    loginContent.style.display = "block";
    contentMain.style.display = "none";
}); 

let isNewChat = false;

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