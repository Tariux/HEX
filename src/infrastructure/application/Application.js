const { ToolManager } = require("../utils/ToolManager");
const CommandDispatcher = require("./command/CommandDispatcher");
const EventManager = require("./events/EventManager");
const Loader = require("./loader/Loader");

class Application {
    constructor() {
        this.loader = new Loader();
        this.dispathcer = new CommandDispatcher();
        this.event = new EventManager();
    }
    run() {
        this.loader.registerLoaders();
        this.dispathcer.autoRegisterCommands();
    }

}

module.exports = Application;