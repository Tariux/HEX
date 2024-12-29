const ConfigCenter = require("../../config/ConfigCenter");
const LoaderResolver = require("../loader/LoaderResolver");
const fs = require('fs');
const path = require('path');
const Command = require("./Command");

class CommandRouter {

    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        this.handlersPath = ConfigCenter.getInstance().get('commandsPath') || false;
    }

    validateCommandFile(filePath) {
        if (path.extname(filePath) !== '.js') {
            return false;
        }
        let CommandClass;
        try {
            CommandClass = require(filePath);

        } catch (error) {
            console.log('[CommandRouter] error while loading ' + filePath, error );
        }
        if (!CommandClass) {
            return false;
        }

        if (
            !CommandClass?.descriptor ||
            !CommandClass?.descriptor.commandName ||
            !CommandClass?.descriptor.type ||
            !CommandClass?.descriptor.protocol ||
            !CommandClass?.descriptor.routes ||
            typeof CommandClass?.descriptor.routes !== 'object'
        ) {
            return false;
        }

        return true;
    }



    registerCommand(filePath) {
        if (!this.validateCommandFile(filePath)) {
            console.log('[CommandRouter] error while validating ', filePath);
            return;
        }
        const CommandClass = require(filePath);

        const loadedEntities = LoaderResolver.resolveCommandEntities(CommandClass.descriptor.loader);
        const handlerInstance = new CommandClass(loadedEntities || undefined);

        handlerInstance.descriptor = CommandClass.descriptor;

        if (handlerInstance.descriptor && handlerInstance.descriptor.routes) {
            this.dispatcher.registerHandler(handlerInstance.descriptor, handlerInstance);
            const routes = handlerInstance.descriptor.routes;
            delete handlerInstance.descriptor.routes;
            routes.forEach(route => {
                const descriptor = { ...handlerInstance.descriptor, ...route };
                const loadedEntities = LoaderResolver.resolveCommandEntities(route.loader);
                this.dispatcher.registerRouteListener(descriptor, loadedEntities || {})
            });
        } else {
            this.log(`Skipping file: ${file}. It does not export a valid descriptor. make sure is static in your command`);
        }
    }

    registerCommands() {
        if (typeof this.handlersPath === 'string') {
            const files = fs.readdirSync(this.handlersPath);
            files.forEach(file => {
                const filePath = path.join(this.handlersPath, file);
                this.registerCommand(filePath);
            });
        } else if (typeof this.handlersPath === 'object') {
            this.handlersPath.forEach(key => {
                const files = fs.readdirSync(key);
                files.forEach(file => {
                    const filePath = path.join(key, file);
                    this.registerCommand(filePath);
                });
            });
        } else {
            console.log('[CommandRouter] error while registering commands, no "commandsPath" found!');
        }

    }
}

module.exports = CommandRouter;