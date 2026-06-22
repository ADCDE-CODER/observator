import { createInput } from "./input";
import { createLabel } from "./label";

function createField({tagName = "div", fieldObject = {type: "text", textContent: "New field", id: ""}, options = {className: "", id: "", labelObject: undefined, inputObject: undefined}}) {
    const {className, id, labelObject, inputObject} = options;

    const field = document.createElement(tagName);
    field.className = `${className}`.trim();
    field.id = `${id}`.trim();

    if (labelObject !== undefined) {
        const label = createLabel(labelObject);
        field.appendChild(label);
    } else {
        const object = {
            textContent: `${fieldObject.textContent}:`,
            htmlFor: fieldObject.id
        };
        const label = createLabel(object);
        field.appendChild(label);
    }

    if (inputObject !== undefined) {
        const input = createInput(inputObject);
        field.appendChild(input);
    } else {
        const object = {
            options: {
                id: fieldObject.id,
                name: fieldObject.id,
                type: fieldObject.type,
                placeholder: fieldObject.textContent
            }
        };
        const input = createInput(object);
        field.appendChild(input);
    }

    return field;
}

export { createField };