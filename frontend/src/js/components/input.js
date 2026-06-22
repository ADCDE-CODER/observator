function createInput({options = {className: "", id: "", name: "", type: "text", placeholder: ""}}) {
    const {className, id, name, type, placeholder} = options;

    const input = document.createElement("input");
    input.className = `${className}`.trim();
    input.id = `${id}`.trim();
    input.name = name;
    input.type = type;
    input.placeholder = placeholder;

    return input;
}

export { createInput };