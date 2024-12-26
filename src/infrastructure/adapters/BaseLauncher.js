class BaseLauncher {
    constructor(name) {
        this.name = name;
    }

    /**
     * Starts the service.
     * Must be implemented by subclasses.
     */
    start() {
        if (!this.servers) {
            console.log('SERVER IS NOT IMPLEMENTED FOR LAUNCHER ', this.name);
        }
        this.servers.forEach((instance, key) => {
            try {
                instance.listen().then(() => {
                    this.log(`${key} server is running: http${instance.ssl ? 's' : ''}://${instance.host || 'Uknown'}:${instance.port || 'NaN'}`);
                    instance.updateStatus(true);
                });
            } catch (error) {
                this.log(`${key} server failed`, error);
            }
        });
    }

    /**
     * Stops the service (optional).
     * Can be overridden by subclasses if needed.
     */
    stop() {
        if (!this.servers) {
            console.log('SERVER IS NOT IMPLEMENTED FOR LAUNCHER ', this.name);
        }
        this.servers.forEach((instance, key) => {
            try {
                instance.stop().then(() => {
                    this.log(`${key} server is stopped`);
                    instance.updateStatus(false);
                });
            } catch (error) {
                this.log(`${key} server stop failed`, error);
            }
        });
    }

    getServers() {
        return this.servers || false;
    }

    log(message) {
        console.log(`[${this.name}] ${message}`);
    }
}

module.exports = BaseLauncher;
