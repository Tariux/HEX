const ConfigCenter = require('../../config/ConfigCenter');
const { tools } = require('../../utils/ToolManager');

class Database {
    #config;
    adapters = {
        mongodb: require('./adapters/MongoInterface'),
        redis: require('./adapters/RedisInterface'),
        mysql: require('./adapters/MySqlInterface'),
        sqlite: require('./adapters/SqlLiteInterface'),
    };

    constructor() {
        this.databases = {};
        this.#config = ConfigCenter.getInstance().get('database') || false;
    }

    autoLoadDatabases() {
        if (
            typeof this.#config !== 'object' ||
            this.#config.length <= 0
        ) {
            tools.logger.warn('database config not found')
            return false;
        }
        this.#loadDatabases();
    }

    #loadDatabases() {
        for (const [key, dbConfig] of Object.entries(this.#config)) {
            const { type, ...options } = dbConfig;
            const Adapter = this.adapters[type.toLowerCase()];
            if (!Adapter) {
                tools.logger.error(`Unknown database type: ${type}`);
            }
            try {
                this.databases[key] = new Adapter(options);
                tools.logger.info(`database ${key} registerd with type: ${type}`);
            } catch (error) {
                tools.logger.error(`cannot load database ${key} type: ${type}`);
            }
        }
    }

    getDatabase(key) {
        return this.databases[key];
    }
}

module.exports = Database;