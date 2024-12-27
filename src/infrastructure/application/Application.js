const CommandDispatcher = require("./command/CommandDispatcher");
const EventManager = require("./events/EventManager");
const Loader = require("./loader/Loader");

class Application {
    constructor() {
        this.dispathcer = new CommandDispatcher(this.logger);
        this.event = new EventManager();
        this.loader = new Loader();
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