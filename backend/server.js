import "dotenv/config";
import { env } from "./src/config/env.js";
import app from "./src/app.js";

const PORT = env.port;

app.listen(PORT, () => {
    console.log(`Server started at port http://localhost:${PORT}`);
    console.log("System Ready: All service dependencies initialized.");
});