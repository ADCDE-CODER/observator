import { createElement } from "../components/element";

function createPostPage() {
    const heading = createElement({tagName: "h2", options: {textContent: "Post"}});
    
    const page = createElement({tagName: "section", options: {className: "content-main__page", id: "post"}});
    page.append(heading);

    return page;
}

export { createPostPage };