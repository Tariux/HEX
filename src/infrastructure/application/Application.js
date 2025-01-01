const CommandDispatcher = require("./command/CommandDispatcher");
const Database = require("./database/Database");
const EventManager = require("./events/EventManager");
const Events = require("./events/Events");
const Loader = require("./loader/Loader");

class Application {
    constructor() {
        this.loader = new Loader();
        this.eventManager = new EventManager();
        this.dispathcer = new CommandDispatcher();
        this.events = new Events();
        this.database = new Database();
    }
    run() {
        this.database.autoLoadDatabases();
        this.loader.registerLoaders();
        this.dispathcer.registerCommands();
        this.events.registerEvents();
    }

}

module.exports = Application;