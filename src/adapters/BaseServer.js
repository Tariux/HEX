const Command = require("../application/command/Command");
const EventManager = require("../application/events/EventManager");
const ConfigCenter = require("../config/ConfigCenter");
const SessionManager = require("../utils/SessionManager");
const { tools } = require("../utils/ToolManager");

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
        this.timeout = ConfigCenter.getInstance().get('timeout') || 2000;
        this.#initWhitelist();
    }

    #initWhitelist() {
        this.blacklistConfig = ConfigCenter.getInstance().get('blacklist') || false;
        if (!this.blacklistConfig) {
            return;
        }
        if (typeof this.blacklistConfig?.routes !== 'object') {
            return;
        }
        this.blacklistPatterns = new Set();
        this.blacklistConfig.routes.forEach(exclude => {
            const blacklistPattern = Command.pattern(exclude);
            this.blacklistPatterns.add(blacklistPattern)
        });
    }

    #validateServerConfig(server) {
        return (
            server && server?.host && server?.port && server?.type && server?.name &&
            typeof server?.port === 'number'
        )
    }

    handleIncomingRequest(request, response) {
        const command = new Command(request);
        const requestPattern = command.pattern();
        const responsePattern = `${requestPattern}:RESPONSE`;

        if (this.blacklistPatterns && this.blacklistPatterns.has(requestPattern)) {
            tools.logger.warn(`[REJECT]: new command ${requestPattern} at ${new Date().getTime()}`);
            return new Promise((resolve, reject) => {
                reject('blacklist');
            });
        }

        const incoming = new Promise((resolve, reject) => {
            this.emitter.subscribe(responsePattern, (command) => {
                clearTimeout(timeout)
                resolve(command);
            });
            const timeout = setTimeout(() => {
                tools.logger.info(`[TIMEOUT]: new command ${requestPattern} at ${new Date().getTime()}`);
                reject('timeout');
            }, this.timeout);
        })
        .catch((error) => {
            tools.logger.error(`[ERROR]: new command ${requestPattern} at ${new Date().getTime()}`);
            tools.logger.error(error);
            return new Promise((resolve, reject) => {
                reject('blacklist');
            });
        })
        tools.logger.info(`[OK]: new command ${requestPattern} at ${new Date().getTime()}`);
        command.setSession(new SessionManager(request, response))
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
