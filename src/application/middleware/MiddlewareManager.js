const ConfigCenter = require("../../config/ConfigCenter");
const { tools } = require("../../utils/ToolManager");
const LoaderResolver = require("../loader/LoaderResolver");
const path = require("path");

class MiddlewareManager {
    static middlewares = new Map();
    constructor() {
        this.middlewaresPath = ConfigCenter.getInstance().get("middlewaresPath") || false;
    }

    static getMiddleware(middlewareName) {
        return MiddlewareManager.middlewares.get(middlewareName);
    }

    #validateMiddlewareFile(filePath) {
        if (path.extname(filePath) !== ".js") return false;
        try {
            const MiddlewareClass = require(filePath);
            return this.#validateMiddleware(MiddlewareClass.options);
        } catch (error) {
            tools.logger.error(`cannot load middleware`)
            tools.logger.error(error)
            return;
        }
    }

    #validateMiddleware(options) {
        return (
            options?.middlewareName
        );
    }

    #loadEntities(loader) {
        return LoaderResolver.resolveLoaderEntities(loader) || {};
    }

    registerMiddleware(filePath) {
        try {
            if (!this.#validateMiddlewareFile(filePath)) {
                tools.logger.error(`Invalid middleware file` , filePath)
                return;
            }

            const MiddlewareClass = require(filePath);
            const loadedEntities = this.#loadEntities(MiddlewareClass?.options?.loader);
            const handlerInstance = new MiddlewareClass(loadedEntities);
            if (typeof handlerInstance.handle !== 'function') {
                tools.logger.error(`failed to find middleware handle function from` , filePath);
                return
            }
            handlerInstance.options = MiddlewareClass.options;
            MiddlewareManager.middlewares.set(MiddlewareClass.options.middlewareName, handlerInstance);
            tools.logger.info(`middleware loaded: ${MiddlewareClass.options.middlewareName}`);

        } catch (error) {
            tools.logger.error(`failed to register middleware from` , filePath);
            tools.logger.error(error);
        }
    }

    registerMiddlewares() {
        try {
            if (!this.middlewaresPath || this.middlewaresPath.length <= 0) {
                return;
            }
            const files = LoaderResolver.getFiles(this.middlewaresPath);
            files.forEach((file) => this.registerMiddleware(file));
        } catch (error) {
            tools.logger.error(`error while registering middlewares`);
            tools.logger.error(error);
        }
    }
}

module.exports = MiddlewareManager;
