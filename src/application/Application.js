const ConfigCenter = require("../config/ConfigCenter");
const CommandDispatcher = require("./command/CommandDispatcher");
const Database = require("./database/Database");
const EventManager = require("./events/EventManager");
const Events = require("./events/Events");
const Loader = require("./loader/Loader");
const PackageManager = require("./loader/Packages");
const MiddlewareManager = require("./middleware/MiddlewareManager");

class Application {
    constructor() {
        this.loader = new Loader();
        this.packages = new PackageManager();
        this.eventManager = new EventManager();
        this.dispathcer = new CommandDispatcher();
        this.events = new Events();
        this.database = new Database();
        this.middlewareManager = new MiddlewareManager();
    }
    run() {
        this.database.autoLoadDatabases();
        this.loader.registerLoaders();
        this.packages.registerPackages();
        this.dispathcer.registerCommands();
        this.middlewareManager.registerMiddlewares();
        this.events.registerEvents();
    }

}

module.exports = Application;