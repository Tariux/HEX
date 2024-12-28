const CommandDispatcher = require("./command/CommandDispatcher");
const EventManager = require("./events/EventManager");
const Loader = require("./loader/Loader");

class Application {
    constructor() {
        this.loader = new Loader();
        this.dispathcer = new CommandDispatcher(this.logger);
        this.event = new EventManager();
    }
    run() {
        this.loader.registerLoaders();
        this.dispathcer.autoRegister();
    }

    logger(message) {
        console.log(`[Application] ${message}`);
    }
}

module.exports = Application;