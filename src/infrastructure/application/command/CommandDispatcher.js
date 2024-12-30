const EventManager = require('../events/EventManager');
const Command = require('./Command');
const CommandRouter = require('./CommandRouter');

class CommandDispatcher {
    constructor(logger = console, eventManager = EventManager, commandRouter = new CommandRouter(this)) {
        this.log = logger;
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
    subscribeToCommandPattern(descriptor, payload = {}) {
        if (!descriptor) return;
        const requestPattern = Command.pattern(descriptor);
        this.emitter.subscribe(requestPattern, async (command) => {
            try {
                const response = await this.dispatchCommand(requestPattern, payload);
                command.setResponse(response);
                command.setStatusCode(200);
            } catch (error) {
                this.log.error('Route Listener Failed:', error);
                command.setError(error);
                command.setStatusCode(401);
            } finally {
                command.setDispatcher(descriptor);
                this.emitter.publish(`${command.signature}:RESPONSE`, command);
            }
        });
        this.log(`Registered handler for pattern: ${requestPattern}`);
    }

    /**
     * Dispatches a command to its appropriate handler.
     * @param {string} pattern - The command pattern to dispatch.
     * @param {Object} payload - The payload for the command.
     * @returns {Promise} - The result of the command execution.
     */
    async dispatchCommand(pattern, payload = {}) {
        const { handler, method } = this.handlers.get(pattern) || {};
        if (!handler || typeof handler[method] !== 'function') {
            throw new Error(`Handler or method '${method}' not found for pattern: '${pattern}'.`);
        }
        return handler[method](payload);
    }

    /**
     * Automatically registers commands via the CommandRouter.
     */
    autoRegisterCommands() {
        this.commandRouter.registerCommands();
    }
}

module.exports = CommandDispatcher;
