const navHeaderMenu = document.getElementById("nav-header__menu");
const navHeaderProfile = document.getElementById("nav-header__profile");

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

    const isLogin = localStorage.getItem("isLogin");
    
    if (isLogin !== "true") {
        navHeaderMenu.style.display = "none";
        navHeaderProfile.style.display = "none";
        loginMenuButton.style.display = "flex";
        logoutMenuButton.style.display = "none";
    } else {
        navHeaderMenu.style.display = "flex";
        navHeaderProfile.style.display = "flex";
        loginMenuButton.style.display = "none";
        logoutMenuButton.style.display = "flex";
    }
    
    if (storeHistory) {
        history.pushState({ page: id }, "", "");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("#nav-header__menu a");

    for (let i = 0; i < navLinks.length; i++) {
        const navLink = navLinks[i];
        navLink.addEventListener("click", (event) => {
            event.preventDefault();

            const pageID = navLink.getAttribute("href").substring(1);
            showPage(pageID, true);
        })
    }
});

window.addEventListener("popstate", (event) => {
    showPage(event.state.page, false);
});

const logoButton = document.getElementById("nav-header__logo");

logoButton.addEventListener("click", () => {
    showPage("welcome", true);
});

const loginMenuButton = document.getElementById("loginMenu-button");

loginMenuButton.addEventListener("click", () => {
    showPage("sign-menu", true);
}); 

const logoutMenuButton = document.getElementById("logoutMenu-button");

logoutMenuButton.addEventListener("click", () => {
    localStorage.setItem("isLogin", false);
    localStorage.removeItem("token");
    showPage("welcome", true);
});

const signUpButton = document.getElementById("signup-button");

signUpButton.addEventListener("click", async () => {
    const emailInput = document.getElementById("create-email");
    const passwordInput = document.getElementById("create-password");

    const email = emailInput.value;
    const password = passwordInput.value;
    
    try {
        const response = await fetch("http://localhost:3000/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
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
        const response = await fetch("http://localhost:3000/user/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( { email, password } )
        });

        const user = await response.json();

        if (response.ok) {
            if (user.success) {
                emailInput.value = "";
                passwordInput.value = "";

                localStorage.setItem("isLogin", true);
                localStorage.setItem("token", user.token);
                
                showPage("chat", true);
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
    const userInput = document.getElementById("prompt-input").value;
    const userParameter = document.createElement("p");
    userParameter.innerText = userInput;
    
    if (!isNewChat) {
        const chatMenuContent = document.getElementById("content-main__menuContent");
        chatMenuContent.appendChild(userParameter);
        isNewChat = true;
    }

    const output = document.getElementById("content-main__output");
    output.appendChild(userParameter);

    try {
        const token = localStorage.getItem("token");
        
        const response = await fetch("http://localhost:3000/chat/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ userInput })
        });

        const result = await response.json();
        
        const chatParameter = document.createElement("p");
       
        if (response.ok) {
            
            if (result.success) {
                chatParameter.innerText = result.output;
            } else {
                chatParameter.innerText = result.error;
            }
            
            output.appendChild(chatParameter);  
        } else {
            alert(`Chat failed: ${result.error} (status: ${response.status})`);
        }   
    } catch (error) {
        console.log("Chat prompt error: ", error.message);
        alert("Server error while process chat prompt.");
    }
});