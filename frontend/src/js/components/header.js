import { renderNavbarPage } from "../pages/navbarPage";
import { authState } from "../state/authState";
import { createElement } from "./element";

function createHeader() {
    let navbarPage = renderNavbarPage(authState.user);

    const header = createElement({tagName: "header", options: {id: "nav-header"}});
    header.append(navbarPage);

    authState.subscribers(() => {
        const newNavbarPage = renderNavbarPage(authState.user);
        header.replaceChild(newNavbarPage, navbarPage);
        navbarPage = newNavbarPage;
    });

    return header;
};

export {createHeader};