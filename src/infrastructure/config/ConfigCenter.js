
class ConfigCenter {
    static #instance; 
    #config;        
    #initialized = false;

    constructor() {
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
            throw new Error('ConfigCenter has already been initialized.');
        }

        const environment = process.env.NODE_ENV || 'development';
        const baseConfig = this.#loadConfigFile('default');
        const envConfig = this.#loadConfigFile(environment);

        const finalConfig = { ...baseConfig, ...envConfig };

        console.log('[ConfigCenter] Config loaded');
        
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
            return require(`./environments/${name}.js`);
        } catch (error) {
            console.warn(`Configuration file ${name}.js not found. Returning empty object.`);
            return {};
        }
    }

    /**
     * Retrieves the singleton instance of ConfigCenter.
     * @returns {ConfigCenter} The singleton instance.
     */
    static getInstance() {
        if (!ConfigCenter.#instance) {
            ConfigCenter.#instance = new ConfigCenter();
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