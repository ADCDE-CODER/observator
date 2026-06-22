import { createElement } from "../components/element";

function createImagePage() {
    const heading = createElement({tagName: "h2", options: {textContent: "Image"}});
    
    const page = createElement({tagName: "section", options: {className: "content-main__page", id: "image"}});
    page.append(heading);

    return page;
}

export { createImagePage };