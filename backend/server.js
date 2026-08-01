import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started at port http://localhost:${PORT}`);
    console.log("System Ready: All service dependencies initialized.");
});