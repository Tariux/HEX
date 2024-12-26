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
        this.emitter.publish(command.pattern(), command.data)
        return command;
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
