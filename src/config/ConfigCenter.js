const path = require('path');
const { tools } = require('../utils/ToolManager');
require('dotenv').config();

class ConfigCenter {
    static #instance;
    #config;
    #initialized = false;

    constructor(environmentPath) {
        this.environmentPath = environmentPath;
        if (ConfigCenter.#instance) {
            throw new Error('ConfigCenter is a singleton. Use getInstance() to access it.');
        }
    }

    /**
     * Initializes the ConfigCenter.
     * Loads and validates configuration based on the current environment.
     */
    init() {
        if (this.#initialized) {
            tools.logger.error('ConfigCenter has already been initialized');
            return;
        }
        const environment = process.env.NODE_ENV || 'development';
        const baseConfig = this.#loadConfigFile('default');
        const envConfig = this.#loadConfigFile(environment);

        const finalConfig = {
            ...baseConfig,
            ...envConfig,
            credentials: {
                keyPath: path.join(process.cwd(), 'credentials', 'server-key.pem'),
                certPath: path.join(process.cwd(), 'credentials', 'server-cert.crt'),
            }
        };

        tools.logger.info(`config loaded ${this.environmentPath ? 'custom' : 'default'}`, environment);

        this.#config = Object.freeze(finalConfig);
        this.#initialized = true;
        return this.#config;
    }

    /**
     * Lazy initialization: Ensures init is called if config is accessed without explicit init().
     * @returns {Object} The configuration object.
     */
    #ensureInitialized() {
        if (!this.#initialized) {
            this.init();
        }
    }

    /**
     * Loads a configuration file by name.
     * @param {string} name - The name of the config file (without extension).
     * @returns {Object} The configuration object.
     */
    #loadConfigFile(name) {
        try {
            if (this.environmentPath && typeof this.environmentPath === 'string') {
                try {
                    tools.logger.info('found custom environment config path', this.environmentPath);
                    return require(path.join(this.environmentPath, `${name}.js`));
                } catch (error) {
                    tools.logger.error('cannot find custom environment config path', this.environmentPath);
                    return require(`./environments/${name}.js`);
                }
            } else {
                return require(`./environments/${name}.js`);
            }
        } catch (error) {
            tools.logger.warn(`Configuration file ${name}.js not found. Returning empty object.`);
            return {};
        }
    }

    /**
     * Retrieves the singleton instance of ConfigCenter.
     * @returns {ConfigCenter} The singleton instance.
     */
    static getInstance(environmentPath) {
        if (!ConfigCenter.#instance) {
            ConfigCenter.#instance = new ConfigCenter(environmentPath);
        }
        return ConfigCenter.#instance;
    }

    /**
     * Retrieves the full configuration or a specific key.
     * @param {string} [key] - The key to retrieve.
     * @returns {*} The configuration value or full configuration object.
     */
    get(key) {
        this.#ensureInitialized();
        return key ? this.#config[key] : this.#config;
    }

    /**
     * Refreshes the configuration by reloading and validating it.
     */
    refresh() {
        this.#initialized = false;
        this.init();
    }
}

module.exports = ConfigCenter;