const EventManager = require('../events/EventManager');
const Command = require('./Command');
const CommandRouter = require('./CommandRouter');

class CommandDispatcher {
    constructor(logger = console) {
        this.log = logger;
        this.handlers = new Map();
        this.emitter = EventManager.getInstance().emitter;
        this.crouter = new CommandRouter(this)
    }

    registerHandler(commandDescriptor, handler) {
        commandDescriptor.routes.forEach(route => {
            const pattern = Command.pattern({ ...commandDescriptor, ...route });
            if (this.handlers.has(pattern)) {
                throw new Error(`Handler for command pattern ${pattern} is already registered.`);
            }
            this.handlers.set(pattern, { handler, method: route.handler });
        });
    }

    registerRouteListener(descriptor, payload = {}) {
        if (!descriptor) return;
        const requestPattern = Command.pattern(descriptor);
        this.emitter.subscribe(requestPattern, async (command) => {
            try {
                const response = await this.dispatch(requestPattern, payload);
                command.setResponse(response);
                command.setStatusCode(200);
                this.emitter.publish(`${command.signature}:RESPONSE`, command);
            } catch (error) {
                console.log('Route Listener Failed' , error);
                command.setError(error);
                command.setStatusCode(401);
                this.emitter.publish(`${command.signature}:RESPONSE`, command);
            } finally {
                command.setDispatcher(descriptor);
            }
        });
        this.log(`Registered handler for pattern: ${requestPattern}`);

    }

    dispatch(pattern, payload = {}) {
        const { handler, method } = this.handlers.get(pattern) || {};
        if (!handler || typeof handler[method] !== 'function') {
            throw new Error(`No handler or method found for pattern: ${pattern}`);
        }

        return handler[method](payload);
    }


    autoRegister() {
        this.crouter.registerCommands();
    }
}

module.exports = CommandDispatcher;