function createButton({tagName = "button", textContext = "New button", options = {className: "", id: "", type: "button"}, onClick = null}) {
    const {className, id, type} = options;
    
    const button = document.createElement(tagName);
    button.textContent = textContext;
    button.className = `${className}`.trim();
    button.id = `${id}`.trim();
    button.type = type;
    button.addEventListener("click", onClick);
    
    return button;
}

export { createButton };