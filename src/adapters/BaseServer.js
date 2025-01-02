const Command = require("../application/command/Command");
const EventManager = require("../application/events/EventManager");

class BaseServer {
    status = false;

    constructor(config) {
        if (!this.#validateServerConfig(config)) {
            return;
        }
        this.port = config.port;
        this.host = config.host;
        this.ssl = config.ssl;
        this.emitter = EventManager.getInstance().emitter;
    }

    #validateServerConfig(server) {
        return (
            server && server?.host && server?.port && server?.type && server?.name &&
            typeof server?.port === 'number'
        )
    }

    handleIncomingRequest(request) {
        const command = new Command(request);
        const requestPattern = command.pattern();
        const responsePattern = `${requestPattern}:RESPONSE`;
        
        const incoming = new Promise((resolve, reject) => {
            this.emitter.subscribe(responsePattern, (command) => {
                resolve(command);
            });
            setTimeout(() => {
                reject('timeout');
            }, 2000);
        })

        this.emitter.publish(requestPattern, command);
        return incoming;

    }

    listen() {
        throw new Error(`Listen method not implemented in ${this.constructor.name}`);
    }

    stop() {
        throw new Error(`Stop method not implemented in ${this.constructor.name}`);
    }

    updateStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

}

module.exports = BaseServer;