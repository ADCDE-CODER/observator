function createNavbar({lists = {}, options = {navCointainerElement: "div", navCointainerClassName: "", navContainerId: "", navClassName: "", navId: ""}}) {
    const {navCointainerElement, navCointainerClassName, navContainerId, navClassName, navId} = options;

    const navCointainer = document.createElement(navCointainerElement);
    navCointainer.className = `${navCointainerClassName}`.trim();
    navCointainer.id = `${navContainerId}`.trim();

    Object.keys(lists).forEach(key => {
        const value = lists[key];

        // If value is a DOM node, then wrap and append
        if (value instanceof Node) {
            navCointainer.appendChild(value);
            return;
        }

        // If value is an array, then create a <ul> with <li><a>
        if (Array.isArray(value)) {
            const nav = document.createElement("nav");
            nav.className = `${navClassName}`.trim();
            nav.id = `${navId}`.trim();

            const ul = document.createElement("ul");
            ul.className = key;

            const li = document.createElement("li");
            
            value.forEach(item => {
                if (item instanceof Node) {
                    li.appendChild(item);
                    ul.appendChild(li);
                }
            });
            
            nav.appendChild(ul);
            navCointainer.appendChild(nav);
            return;
        }
    });

    return navCointainer;
}

export { createNavbar }