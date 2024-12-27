const fs = require('fs');
const path = require('path');
const EventManager = require('../events/EventManager');
const Command = require('./Command');

class CommandDispatcher {
    constructor(logger = console) {
        this.log = logger;
        this.handlers = new Map();
        this.emitter = EventManager.getInstance().emitter;
    }

    registerHandler(commandDescriptor, handler) {
        commandDescriptor.routes.forEach(route => {
            const pattern = Command.pattern({...commandDescriptor, ...route});
            if (this.handlers.has(pattern)) {
                throw new Error(`Handler for command pattern ${pattern} is already registered.`);
            }
            this.handlers.set(pattern, { handler, method: route.handler });
        });
    }

    dispatch(pattern, payload = {}) {
        const { handler, method } = this.handlers.get(pattern) || {};
        if (!handler || typeof handler[method] !== 'function') {
            throw new Error(`No handler or method found for pattern: ${pattern}`);
        }

        return handler[method](payload);
    }


    autoRegister() {
        const handlersPath = path.join(__dirname, '../../../domain', 'commands');
        const files = fs.readdirSync(handlersPath);
        
        files.forEach(file => {
            
            const filePath = path.join(handlersPath, file);

            if (path.extname(file) === '.js') {
                const CommandClass = require(filePath);

                const handlerInstance = new CommandClass({});

                if (handlerInstance.descriptor && handlerInstance.descriptor.routes) {
                    this.registerHandler(handlerInstance.descriptor, handlerInstance);
                    const routes = handlerInstance.descriptor.routes;
                    delete handlerInstance.descriptor.routes;
                    routes.forEach(route => {

                        const dispatcher = {...handlerInstance.descriptor, ...route};
                        const requestPattern = Command.pattern(dispatcher);
                        this.emitter.subscribe(requestPattern, async (command) => {
                            try {
                                const response = await this.dispatch(requestPattern);
                                command.recordResponse(response);
                                command.recordStatusCode(200);
                                this.emitter.publish(`${command.signature}:RESPONSE`, command);
                            } catch (error) {
                                command.recordError(error);
                                command.recordStatusCode(401);
                                this.emitter.publish(`${command.signature}:RESPONSE`, command);
                            } finally {
                                command.recordDispatcher(dispatcher);
                            }
                        });

                        this.log(`Registered handler for pattern: ${requestPattern}`);
                    });
                } else {
                    this.log(`Skipping file: ${file}. It does not export a valid handler.`);
                }
            }
        });
    }
}

module.exports = CommandDispatcher;