export default class ChatMetadataModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = `
            CREATE TABLE IF NOT EXISTS chatmetadata (
                provider TEXT NOT NULL,
                provider_config TEXT,
                model TEXT,
                config TEXT,
                chat_id INTEGER PRIMARY KEY,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(provider, providerConfig, model, config, chatId) {
        provider = JSON.stringify(provider);
        providerConfig = JSON.stringify(providerConfig);
        model = JSON.stringify(model);
        config = JSON.stringify(config);

        this.db.prepare("INSERT INTO chatmetadata(provider, provider_config, model, config, chat_id) VALUES (?, ?, ?, ?, ?)").run(provider, providerConfig, model, config, chatId);
    }

    findById(chatId) {
        const metadata = this.db.prepare("SELECT * FROM chatmetadata WHERE chat_id = ?").get(chatId);
        
        return {
            provider: JSON.parse(metadata.provider),
            providerConfig: JSON.parse(metadata.provider_config),
            model: JSON.parse(metadata.model),
            config: JSON.parse(metadata.config),
            chatId : metadata.chat_id
        }
    }

    update(provider, providerConfig, model, config, chatId) {
        provider = JSON.stringify(provider);
        providerConfig = JSON.stringify(providerConfig);
        model = JSON.stringify(model);
        config = JSON.stringify(config);

        return this.db.prepare(`UPDATE chatmetadata SET provider = ?, provider_config = ?, model = ?, config = ? WHERE chat_id = ?`).run(provider, providerConfig, model, config, chatId);
    }

    updateProviderConfig(providerConfig, chatId) {
        providerConfig = JSON.stringify(providerConfig);
        return this.db.prepare(`UPDATE chatmetadata SET provider_config = ? WHERE chat_id = ?`).run(providerConfig, chatId);
    }

    updateModel(model, chatId) {
        model = JSON.stringify(model);
        return this.db.prepare(`UPDATE chatmetadata SET model = ? WHERE chat_id = ?`).run(model, chatId);
    }

    updateConfig(config, chatId) {
        config = JSON.stringify(config);
        return this.db.prepare(`UPDATE chatmetadata SET config = ? WHERE chat_id = ?`).run(config, chatId);
    }
}