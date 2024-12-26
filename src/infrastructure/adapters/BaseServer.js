const Command = require("../application/command/Command");
const EventManager = require("../application/events/EventManager");

class BaseServer {
    status = false;

    constructor(config) {
        this.port = config.port;
        this.host = config.host;
        this.ssl = config.ssl;
        this.emitter = EventManager.getInstance().emitter;
    }

    handleIncomingRequest(request) {
        const command = new Command(request);
        const requestPattern = command.pattern();
        const responsePattern = Command.pattern({...command.data, type: 'RESPONSE'});
        const incoming = new Promise((resolve, reject) => {
            this.emitter.subscribe(responsePattern, (response) => {
                resolve(response);
            });

            setTimeout(() => {
                resolve('timeout');
            }, 5000);
        });
        this.emitter.publish(requestPattern, command);
        return incoming;
    }

    listen() {
        throw new Error(`Listen method not implemented in ${this.name}`);
    }

    stop() {
        throw new Error(`Stop method not implemented in ${this.name}`);
    }

    updateStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }

    log(message) {
        console.log(`[${this.host}:${this.port}] ${message}`);
    }
}

module.exports = BaseServer;
