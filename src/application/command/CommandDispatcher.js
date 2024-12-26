const fs = require('fs');
const path = require('path');
const Command = require('./Command');

class CommandDispatcher {
    constructor(logger = console) {
        this.log = logger;
        this.handlers = new Map();
    }

    registerHandler(commandName, handler) {
        if (this.handlers.has(commandName)) {
            throw new Error(`Handler for command ${commandName} is already registered.`);
        }
        this.handlers.set(commandName, handler);
    }

    dispatch(command) {
        const handler = this.handlers.get(command);
        if (!handler) {
            throw new Error(`No handler found for command: ${command}`);
        }
        if (typeof handler.handle !== 'function') {
            throw new Error(`No handle function found for command: ${command}`, handler.handle);
        }
        return handler.handle(handler.payload || {});
    }

    autoRegister() {
        const handlersPath = path.join(__dirname, 'handlers');
        const files = fs.readdirSync(handlersPath);

        files.forEach(file => {
            const filePath = path.join(handlersPath, file);
            if (path.extname(file) === '.js') {
                const CommandClass = require(filePath); 
                const handlerInstance = new CommandClass();

                if (handlerInstance.commandName && typeof handlerInstance.handle === 'function') {
                    this.registerHandler(handlerInstance.commandName, handlerInstance);
                    this.log(`Registered handler for command: ${handlerInstance.commandName}`);
                } else {
                    this.log(`Skipping file: ${file}. It does not export a valid handler.`);
                }
            }
        });
    }
}

module.exports = CommandDispatcher;
