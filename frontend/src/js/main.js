import { createApp } from "./app";
import { showPage } from "./pages/showPage";

const {header, main} = await createApp();
document.body.append(header, main);
showPage("welcome", false);