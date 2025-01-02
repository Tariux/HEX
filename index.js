const hex = require("./src/main");
const Database = require("./src/application/database/Database");
const Events = require("./src/application/events/Events");
const Loader = require("./src/application/loader/Loader");
const PackageManager = require("./src/application/loader/Packages");

exports._HEX = hex;
exports._PACKAGES = PackageManager;
exports._LOADER = Loader;
exports._DB = Database;
exports._EVENT = Events;