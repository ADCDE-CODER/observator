import "dotenv/config";
import { env } from "./src/config/env.js";
import app from "./src/app.js";

const PORT = env.port;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
    console.log("System Ready: All service dependencies initialized.");
});