import { createButton } from "../components/button";
import { createElement } from "../components/element";
import { createField } from "../components/field";
import { createAccount, readAccount } from "../services/authService";
import { authState } from "../state/authState";

function createSignMenuPage() {
    // Sign up
    const signupEmailField = createField({tagName: "div", fieldObject: {textContent: "Email", id: "create-email"}, options: {className: "menu__label"}});
    const signupPasswordField = createField({tagName: "div", fieldObject: {textContent: "Password", id: "create-password"}, options: {className: "menu__label"}});
    const signUpButton = createButton({tagName: "button", textContext: "Sign up", options: {id: "signup-button"}, onClick: async () => {
        const emailInput = document.getElementById("create-email");
        const passwordInput = document.getElementById("create-password");
        
        const result = await createAccount(emailInput.value, passwordInput.value);
        if (result.ok && result.success) {
            emailInput.value = "";
            passwordInput.value = "";
        }
    }});
    
    const signupHeading = createElement({tagName: "h2", options: {textContent: "Sign up"}});
    const signupMenu = createElement({tagName: "section", options: {className: "menu"}});
    signupMenu.append(signupHeading, signupEmailField, signupPasswordField, signUpButton);

    // Sign in
    const signinEmailField = createField({tagName: "div", fieldObject: {textContent: "Email", id: "read-email"}, options: {className: "menu__label"}});
    const signinPasswordField = createField({tagName: "div", fieldObject: {textContent: "Password", id: "read-password"}, options: {className: "menu__label"}});
    const signInButton = createButton({tagName: "button", textContext: "Sign in", options: {id: "signin-button"}, onClick: async () => {
        const emailInput = document.getElementById("read-email");
        const passwordInput = document.getElementById("read-password");
        
        const result = await readAccount(emailInput.value, passwordInput.value);
        if (result.ok && result.success) {
            emailInput.value = "";
            passwordInput.value = "";
            
            authState.setUser(result.user);
            authState.setToken(result.token);
            authState.notification();
        }
    }});

    const signinHeading = createElement({tagName: "h2", options: {textContent: "Sign in"}});
    const signinMenu = createElement({tagName: "section", options: {className: "menu"}});
    signinMenu.append(signinHeading, signinEmailField, signinPasswordField, signInButton);

    // Card
    const heading = createElement({tagName: "h2", options: {textContent: "Enter your information"}});
    const card = createElement({tagName: "div", options: {className: "card"}});
    card.append(heading, signupMenu, signinMenu);

    // Page
    const page = createElement({tagName: "section", options: {className: "content-main__page", id: "sign-menu"}});
    page.append(card);

    return page;
}

export { createSignMenuPage };