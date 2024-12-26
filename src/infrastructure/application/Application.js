const CommandDispatcher = require("./command/CommandDispatcher");
const EventManager = require("./events/EventManager");

class Application {
    constructor() {
        this.dispathcer = new CommandDispatcher(this.logger);
        this.event = new EventManager();
    }
    run() {
        this.dispathcer.autoRegister();
    }

    logger(message) {
        console.log(`[Application] ${message}`);
    }
}

module.exports = Application;