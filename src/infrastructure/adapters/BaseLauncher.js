const { tools } = require("../utils/ToolManager");

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
            tools.logger.error('define servers for launcher', this.name);
        }
        this.servers.forEach((instance, key) => {
            try {
                instance.listen().then(() => {
                    tools.logger.info(`${key} server is running: http${instance.ssl ? 's' : ''}://${instance.host || 'Uknown'}:${instance.port || 'NaN'}`);
                    instance.updateStatus(true);
                });
            } catch (error) {
                tools.logger.error(`${key} server failed`);
                tools.logger.error(error);
            }
        });
    }

    /**
     * Stops the service (optional).
     * Can be overridden by subclasses if needed.
     */
    stop() {
        if (!this.servers) {
            tools.logger.error('define servers for launcher', this.name);
        }
        this.servers.forEach((instance, key) => {
            try {
                instance.stop().then(() => {
                    tools.logger.info(`${key} server is stopped`);
                    instance.updateStatus(false);
                });
            } catch (error) {
                tools.logger.error(`${key} server stop failed`);
                tools.logger.error(error);
            }
        });
    }

    getServers() {
        return this.servers || false;
    }

}

module.exports = BaseLauncher;
