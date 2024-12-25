class BaseLauncher {
    constructor(name) {
        this.name = name;
    }

    /**
     * Starts the service.
     * Must be implemented by subclasses.
     */
    async start() {
        throw new Error(`Start method not implemented in ${this.name}`);
    }

    /**
     * Stops the service (optional).
     * Can be overridden by subclasses if needed.
     */
    async stop() {
        console.log(`${this.name} stopped.`);
    }

    log(message) {
        console.log(`[${this.name}] ${message}`);
    }
}

module.exports = BaseLauncher;
