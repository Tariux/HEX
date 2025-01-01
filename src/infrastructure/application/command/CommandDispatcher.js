const { tools } = require('../../utils/ToolManager');
const EventManager = require('../events/EventManager');
const Command = require('./Command');
const CommandRouter = require('./CommandRouter');

class CommandDispatcher {
    constructor(
        eventManager = EventManager,
        commandRouter = new CommandRouter(this)
    ) {
        this.handlers = new Map();
        this.emitter = eventManager.getInstance().emitter;
        this.commandRouter = commandRouter;
    }

    /**
     * Registers a handler for a given command descriptor.
     * @param {Object} commandDescriptor - The descriptor defining the command and its routes.
     * @param {Object} handler - The handler object containing methods to handle the command.
     */
    registerCommandHandler(commandDescriptor, handler) {
        commandDescriptor.routes.forEach(route => {
            const pattern = Command.pattern({ ...commandDescriptor, ...route });
            if (this.handlers.has(pattern)) {
                throw new Error(`Handler for command pattern '${pattern}' is already registered.`);
            }
            this.handlers.set(pattern, { handler, method: route.handler });
        });
    }

    /**
     * Subscribes to a command pattern and listens for incoming commands.
     * @param {Object} descriptor - The descriptor for the command pattern.
     * @param {Object} [payload={}] - Optional payload data.
     */
    subscribeToCommandPattern(descriptor, loaded) {
        if (!descriptor) return;
        const requestPattern = Command.pattern(descriptor);
        this.emitter.subscribe(requestPattern, (command) => {
            try {
                this.dispatchCommand(requestPattern, loaded, command).then(response => {
                    command.setResponse(response);
                    command.setStatusCode(200);
                    command.setDispatcher(descriptor);
                    this.emitter.publish(`${command.signature}:RESPONSE`, command);
                });
            } catch (error) {
                tools.logger.error('publish to command failed');
                tools.logger.error(error);
                command.setError(error);
                command.setStatusCode(401);
                this.emitter.publish(`${command.signature}:RESPONSE`, command);
            }
        });
        tools.logger.info(`registered handler for pattern: ${requestPattern}`);
    }

    /**
     * Dispatches a command to its appropriate handler.
     * @param {string} pattern - The command pattern to dispatch.
     * @param {Object} payload - The payload for the command.
     * @returns {Promise} - The result of the command execution.
     */
    async dispatchCommand(pattern, payload = {}, command = false) {
        const { handler, method } = this.handlers.get(pattern) || {};
        if (!handler || typeof handler[method] !== 'function') {
            throw new Error(`handler or method '${method}' not found for pattern: '${pattern}'.`);
        }
        if (command) {
            handler.command = command.data;
        }
        return handler[method](payload);
    }

    /**
     * Automatically registers commands via the CommandRouter.
     */
    registerCommands() {
        this.commandRouter.registerCommands();
    }
}

module.exports = CommandDispatcher;
