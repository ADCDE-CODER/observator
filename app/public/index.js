function hidePages() {
    const pages = document.getElementsByClassName("content-main__page");
    
    for (let i = 0; i < pages.length; i++) {
        const element = pages[i];
        element.style.display = "none";
    }
    const welcomeScreen = document.getElementById("welcome");
    welcomeScreen.style.display = "flex";
}

const signMenu = document.getElementById("sign-menu");
const contentMain = document.getElementById("content-main");

const logoButton = document.getElementById("nav-header__logo");

logoButton.addEventListener("click", () => {
    signMenu.style.display = "none";
    contentMain.style.display = "block";
});

const loginMenuButton = document.getElementById("loginMenu-button");

loginMenuButton.addEventListener("click", () => {
    signMenu.style.display = "flex";
    contentMain.style.display = "none";
}); 

const signUpButton = document.getElementById("signup-button");

signUpButton.addEventListener("click", async () => {
    const emailInput = document.getElementById("create-email");
    const passwordInput = document.getElementById("create-password");

    const email = emailInput.value;
    const password = passwordInput.value;
    
    try {
        const response = await fetch("http://localhost:3000/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user: {email, password} })
        });

        const data = await response.json();

        if (response.ok) {
            emailInput.value = "";
            passwordInput.value = "";

            alert("Your account is created!");
        } else {
            alert(`Signup failed: ${data.error} (status: ${response.status})`);
        }
    } catch (error) {
        console.log("Fetch error: ", error.message);
        alert("Network error or server not reachable.");
    }
});

const signInButton = document.getElementById("signin-button");

signInButton.addEventListener("click", async () => {
    const emailInput = document.getElementById("read-email");
    const passwordInput = document.getElementById("read-password");

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch("http://localhost:3000/user/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( {user: {email, password}} )
        });

        const user = await response.json();

        if (response.ok) {
            if (user.success) {
                emailInput.value = "";
                passwordInput.value = "";

                alert("You sign in!");
            } else {
                alert("There is no account!");
            }  
        } else {
            alert(`Signin failed: ${user.error} (status: ${response.status})`);
        } 
    } catch (error) {
        console.log("Sign in error: ", error.message);
        alert("Server error while signing in.");
    }
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