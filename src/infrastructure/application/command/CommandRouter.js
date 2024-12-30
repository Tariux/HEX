const ConfigCenter = require("../../config/ConfigCenter");
const LoaderResolver = require("../loader/LoaderResolver");
const fs = require("fs");
const path = require("path");

class CommandRouter {
    constructor(dispatcher, logger = console) {
        this.dispatcher = dispatcher;
        this.handlersPath = ConfigCenter.getInstance().get("commandsPath") || false;
        this.log = logger;
    }

    validateCommandFile(filePath) {
        if (path.extname(filePath) !== ".js") return false;

        try {
            const CommandClass = require(filePath);
            return this.validateDescriptor(CommandClass.descriptor);
        } catch (error) {
            this.log(`[CommandRouter] Error while loading ${filePath}:`, error);
            return false;
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
        return LoaderResolver.resolveCommandEntities(loader) || {};
    }

    registerCommand(filePath) {
        try {
            if (!this.validateCommandFile(filePath)) {
                throw new Error(`Invalid command file: ${filePath}`);
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
                this.log(
                    `[CommandRouter] Skipping file: ${filePath}. Descriptor or routes are invalid.`
                );
            }
        } catch (error) {
            this.log(
                `[CommandRouter] Failed to register command from ${filePath}:`,
                error
            );
        }
    }

    getCommandFiles() {
        if (typeof this.handlersPath === "string") {
            return fs
                .readdirSync(this.handlersPath)
                .map((file) => path.join(this.handlersPath, file));
        }
        if (Array.isArray(this.handlersPath)) {
            return this.handlersPath.flatMap((dir) =>
                fs.readdirSync(dir).map((file) => path.join(dir, file))
            );
        }
        throw new Error('[CommandRouter] No valid "commandsPath" found!');
    }

    registerCommands() {
        try {
            const files = this.getCommandFiles();
            files.forEach((file) => this.registerCommand(file));
        } catch (error) {
            this.log(`[CommandRouter] Error while registering commands:`, error);
        }
    }
}

module.exports = CommandRouter;
