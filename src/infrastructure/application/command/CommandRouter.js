const ConfigCenter = require("../../config/ConfigCenter");
const { tools } = require("../../utils/ToolManager");
const LoaderResolver = require("../loader/LoaderResolver");
const path = require("path");

class CommandRouter {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
        this.handlersPath = ConfigCenter.getInstance().get("commandsPath") || false;
    }

    validateCommandFile(filePath) {
        if (path.extname(filePath) !== ".js") return false;
        try {
            const CommandClass = require(filePath);
            return this.validateDescriptor(CommandClass.descriptor);
        } catch (error) {
            tools.logger.error(`cannot load entities`)
            tools.logger.error(error)
            return;
        }
    }

    validateDescriptor(descriptor) {
        return (
            descriptor?.commandName &&
            descriptor?.type &&
            descriptor?.protocol &&
            Array.isArray(descriptor?.routes)
        );
    }

    loadEntities(loader) {
        return LoaderResolver.resolveLoaderEntities(loader) || {};
    }

    registerCommand(filePath) {
        try {
            if (!this.validateCommandFile(filePath)) {
                tools.logger.error(`Invalid command file` , filePath)
                return;
            }

            const CommandClass = require(filePath);
            const loadedEntities = this.loadEntities(CommandClass.descriptor.loader);
            const handlerInstance = new CommandClass(loadedEntities);

            handlerInstance.descriptor = CommandClass.descriptor;

            if (handlerInstance.descriptor?.routes) {
                this.dispatcher.registerCommandHandler(
                    handlerInstance.descriptor,
                    handlerInstance
                );

                const routes = handlerInstance.descriptor.routes;
                delete handlerInstance.descriptor.routes;

                routes.forEach((route) => {
                    const descriptor = { ...handlerInstance.descriptor, ...route };
                    const routeEntities = this.loadEntities(route.loader);
                    this.dispatcher.subscribeToCommandPattern(descriptor, routeEntities);
                });
            } else {
                tools.logger.warn(`skipping file: ${filePath}. Descriptor or routes are invalid`)
            }
        } catch (error) {
            tools.logger.error(`failed to register command from` , filePath);
            tools.logger.error(error);
        }
    }

    registerCommands() {
        try {
            const files = LoaderResolver.getFiles(this.handlersPath);
            files.forEach((file) => this.registerCommand(file));
        } catch (error) {
            tools.logger.error(`error while registering commands`);
            tools.logger.error(error);
        }
    }
}

module.exports = CommandRouter;
