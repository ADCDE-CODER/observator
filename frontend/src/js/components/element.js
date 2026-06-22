function createElement({tagName = "div", options = {textContent: "", className: "", id: ""}}) {
    const {textContent, className, id} = options;

    const element = document.createElement(tagName);
    element.textContent = textContent;
    element.className = `${className}`.trim();
    element.id = `${id}`.trim();

    return element;
}

export { createElement }