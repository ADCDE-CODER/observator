import { app } from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Your port is: " + "http://localhost:" + PORT);
});