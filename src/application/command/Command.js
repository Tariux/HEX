const { tools } = require("../../utils/ToolManager");
const CommandParser = require("./CommandParser");

class Command {
    constructor(request) {
        this.#init(request);
    }

    #init(request) {
        try {
            const {data, type} = new CommandParser(request).parse();
            this.data = data;
            this.type = type;
            tools.logger.info(`+ new command: ${this.pattern()} at ${new Date().getTime()}`);
        } catch (error) {
            tools.logger.error(`command failed`);
            tools.logger.error(error);
        }
    }

    pattern() {
        this.signature = Command.pattern(this.data);
        return this.signature;
    }

    setResponse(response) {
        this.response = response;
    }

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
    }

    setError(error) {
        this.error = error;
    }

    setStatusCode(status) {
        this.statusCode = status;
    }

    static pattern(data) {
        const { type, protocol, method, target } = data;
        return `COMMAND:${type}.${protocol}:${method}:${target.toUpperCase()}`;
    }
}

module.exports = Command;
