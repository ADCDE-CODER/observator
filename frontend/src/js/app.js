import "./styles/styles.css"
import { createHeader } from "./components/header.js";
import { createMain } from "./components/main.js";
import { authState } from "./state/authState.js";

async function createApp() {
    authState.loadLocalStorage();

    const header = createHeader();
    const main = await createMain();

    return {header, main};
}

export { createApp };