function createImage({src = "", alt = "", options = {className: "", id: ""}}) {
    const {className, id} = options;
    
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.className = `${className}`.trim();
    img.id = `${id}`.trim();

    return img;
}

export { createImage };