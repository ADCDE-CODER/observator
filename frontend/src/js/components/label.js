function createLabel({textContent = "New label", htmlFor = "New input", options = {className: "", id: ""}}) {
    const {className, id} = options;

    const label = document.createElement("label");
    label.textContent = textContent;
    label.htmlFor = htmlFor;
    label.className = `${className}`.trim();
    label.id = `${id}`.trim();

    return label;
}

export { createLabel };