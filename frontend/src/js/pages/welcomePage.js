import { createElement } from "../components/element";

function createWelcomePage() {
    const heading = createElement({tagName: "h2", options: {textContent: "Welcome!"}});
    
    const page = createElement({tagName: "section", options: {className: "content-main__page", id: "welcome"}});
    page.appendChild(heading);

    return page;
}

export { createWelcomePage };