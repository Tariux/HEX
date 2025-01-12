const { tools } = require('../../utils/ToolManager');
const EventManager = require('../events/EventManager');
const MiddlewareManager = require('../middleware/MiddlewareManager');
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
                throw new Error(`handler for command pattern '${pattern}' is already registered.`);
            }
            this.handlers.set(pattern, { handler, method: route.handler, middlewares: route.middlewares });
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
                command.setStatusCode(400);
                this.emitter.publish(`${command.signature}:RESPONSE`, command);
            }
        });
        tools.logger.info(`command handler loaded: ${requestPattern}`);
    }

    async #runMiddlewares(middlewares, command, payload = {}) {
        middlewares = middlewares.reverse();
    
        class NextError extends Error {
            constructor() {
                super('Next called');
                this.name = 'NextError';
            }
        }
    
        const next = async (index) => {
            if (index >= middlewares.length) {
                return;
            }
    
            const middleware = middlewares[index];
            let callableMiddleware;
    
            if (typeof middleware === 'object' && typeof middleware.handle === 'function') {
                callableMiddleware = middleware.handle.bind(middleware);
            } else if (typeof middleware === 'function') {
                callableMiddleware = middleware;
            } else {
                throw new Error(`Middleware at index ${index} is not a valid middleware`);
            }
    
            try {
                await callableMiddleware(command, async () => {
                    throw new NextError(); 
                }, payload);
            } catch (error) {
                if (error instanceof NextError) {
                    await next(index + 1);
                } else {
                    throw {
                        errorMessage: error.message || `Error while running middleware at index ${index}, error: ${error.toString()}`,
                        middleware: middleware.options?.middlewareName || `Middleware at index ${index}`,
                        originalError: error, // Include the original error for debugging
                    };
                }
            }
        };
    
        // Start the middleware chain
        try {
            await next(0);
        } catch (error) {
            // Handle the final error and log it
            console.error('Middleware chain failed:', error.errorMessage);
            throw error; // Rethrow the error if needed
        }
    }
    #loadMiddlewares(middlewares) {
        const loadedMiddlewares = [];
        if (typeof middlewares === 'string') {
            const middleware = MiddlewareManager.getMiddleware(middlewares);
            loadedMiddlewares.push(middleware);
        } else if (typeof middlewares === 'function') {
            loadedMiddlewares.push(middlewares);
        } else if (typeof middlewares === 'object') {
            middlewares.forEach(middleware => {
                loadedMiddlewares.push(...this.#loadMiddlewares(middleware));
            });
        }
        return loadedMiddlewares;
    }


    /**
     * Dispatches a command to its appropriate handler.
     * @param {string} pattern - The command pattern to dispatch.
     * @param {Object} payload - The payload for the command.
     * @returns {Promise} - The result of the command execution.
     */
    async dispatchCommand(pattern, payload = {}, command) {
        const { handler, method, middlewares } = this.handlers.get(pattern) || {};
        if (!handler || typeof handler[method] !== 'function') {
            throw new Error(`handler or method '${method}' not found for pattern: '${pattern}'.`);
        }

        handler.command = command.data;
        let handlerMiddlewares;
        let beforeMiddlewares = [];
        let afterMiddlewares = [];
        if (!middlewares) {
            return handler[method](payload);
        } else {
            handlerMiddlewares = this.#loadMiddlewares(middlewares);
            handlerMiddlewares.forEach(middleware => {
                if (middleware?.options?.type && middleware?.options?.type === 'after') {
                    afterMiddlewares.push(middleware);
                } else {
                    beforeMiddlewares.push(middleware);
                }
            });
        }


        const handlerProxy = async () => {
            let result;
            let afterResult
            let beforeMiddlewaresStatus = true;
            try {
                if (beforeMiddlewares) {
                    await this.#runMiddlewares(beforeMiddlewares, command);
                }
            } catch (error) {
                if (typeof error === 'object') {
                    tools.logger.error(`Error while running middleware ${error.middleware}`);
                    tools.logger.error(error.errorMessage);
                    beforeMiddlewaresStatus = new Error(error.errorMessage)
                } else {
                    tools.logger.error('Error while running middlewares');
                    tools.logger.error(error);
                    beforeMiddlewaresStatus = error
                }
            }

            if (beforeMiddlewaresStatus === true) {
                result = await handler[method](payload);
            } else {
                result = beforeMiddlewaresStatus.message || 'error while running middlewares';
            }
            afterResult = result;

            try {
                if (afterMiddlewares) {
                    let index = 0;
                    const next = function (newResult = false) {
                        afterResult = newResult;
                        index++;
                    }
                    while (index < afterMiddlewares.length) {
                        const middleware = afterMiddlewares[index];
                        try {
                            let oldIndex = index;
                            await middleware.handle(command, next, afterResult);
                            if (oldIndex === index) {
                                index++;
                            }
                        } catch (error) {
                            console.log('Error while running after middleware', error);
                        }
                    }
                }
            } catch (error) {
                console.log('error whille running after middlewares');
            }

            if (afterMiddlewares) {
                return afterResult;
            } else {
                return result;
            }
        };

        return handlerProxy();
    }
    /**
     * Automatically registers commands via the CommandRouter.
     */
    registerCommands() {
        this.commandRouter.registerCommands();
    }
}

module.exports = CommandDispatcher;
