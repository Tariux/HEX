const Command = require("../application/command/Command");
const EventManager = require("../application/events/EventManager");
const ConfigCenter = require("../config/ConfigCenter");

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
        this.#initWhiteList();
    }

    #initWhiteList() {
        this.whitelistConfig = ConfigCenter.getInstance().get('whitelist') || false;
        if (!this.whitelistConfig || typeof this.whitelistConfig?.routes === 'object') {
            return true;
        }
        this.whitelistPatterns = new Set();
        

        this.whitelistConfig.routes.forEach(exclude => {
            const whitelistMockCommand = new Command(exclude);
            const whitelistPattern = whitelistMockCommand.pattern();
            this.whitelistPatterns.add(whitelistPattern)
        });
        console.log(this.whitelistPatterns);


    }

    #validateServerConfig(server) {
        return (
            server && server?.host && server?.port && server?.type && server?.name &&
            typeof server?.port === 'number'
        )
    }

    #checkWhitelist(requestPattern) {

    }

    handleIncomingRequest(request) {
        const command = new Command(request);
        const requestPattern = command.pattern();
        const responsePattern = `${requestPattern}:RESPONSE`;

        if (this.#checkWhitelist) {
            
        }

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
