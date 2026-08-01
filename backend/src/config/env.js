export const env = {
    port: Number(process.env.PORT ?? 3000),
    databaseFilename: process.env.DATABASE_FILENAME,
    openAIApiKey: process.env.OPENAI_API_KEY,
    accessToken: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET
};