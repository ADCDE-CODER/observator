import { createElement } from "../components/element";

function createVideoPage() {
    const heading = createElement({tagName: "h2", options: {textContent: "Video"}});
    
    const page = createElement({tagName: "section", options: {className: "content-main__page", id: "video"}});
    page.append(heading);

    return page;
}

export { createVideoPage };