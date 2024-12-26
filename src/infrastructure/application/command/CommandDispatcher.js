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

    registerHandler(commandName, handler) {
        if (this.handlers.has(commandName)) {
            throw new Error(`Handler for command ${commandName} is already registered.`);
        }
        this.handlers.set(commandName, handler);
    }

    dispatch(commandName) {
        const handler = this.handlers.get(commandName);
        if (!handler) {
            throw new Error(`No handler found for command: ${commandName}`);
        }
        if (typeof handler.handle !== 'function') {
            throw new Error(`No handle function found for command: ${commandName}`, handler.handle);
        }
        return handler.handle(handler.payload || {});
    }

    autoRegister() {
        const createPattern = (handlerInstance) => {
            const pattern = Command.pattern(handlerInstance)
            return pattern
        }

        const handlersPath = path.join(__dirname, '../../../domain', 'commands');
        const files = fs.readdirSync(handlersPath);

        files.forEach(file => {
            const filePath = path.join(handlersPath, file);
            if (path.extname(file) === '.js') {
                const CommandClass = require(filePath); 
                const handlerInstance = new CommandClass();

                if (handlerInstance.commandName && typeof handlerInstance.handle === 'function') {
                    const requestPattern = createPattern(handlerInstance);
                    const responsePattern = createPattern({...handlerInstance, type: 'RESPONSE'});
                    this.registerHandler(requestPattern, handlerInstance);
                    this.emitter.subscribe(requestPattern, () => {
                        this.emitter.publish(responsePattern, this.dispatch(requestPattern))
                    });
                    this.log(`Registered handler for command: ${requestPattern}`);
                } else {
                    this.log(`Skipping file: ${file}. It does not export a valid handler.`);
                }
            }
        });
    }
}

module.exports = CommandDispatcher;
