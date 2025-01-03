const path = require("path");
const ConfigCenter = require("../../config/ConfigCenter");
const { tools } = require("../../utils/ToolManager");

class PackageValidator {
    static validatePackage(packageInput) {
        if (typeof packageInput === "string") {
            try {
                const packageInstance = require(packageInput);
                packageInstace;
            } catch (error) {
                tools.logger.error(`Cannot load package: ${packageInput}`, error);
                return null;
            }
        } else if (typeof packageInput === "object" && packageInput !== null) {
            return packageInput;
        } else {
            tools.logger.error(`Invalid package input type: ${typeof packageInput}`);
            return null;
        }
    }

    static validateFilePath(filePath) {
        if (path.extname(filePath) !== ".js") {
            tools.logger.error(`Invalid file extension for path: ${filePath}`);
            return null;
        }
        try {
            return require(filePath);
        } catch (error) {
            tools.logger.error(`Cannot load package from file: ${filePath}`, error);
            return null;
        }
    }
}

class Package {
    constructor(packageName, instance) {
        this.packageName = packageName;
        this.instance = instance;
    }
}

class PackageManager {
    static #packages = new Map();
    constructor() {
        this.packagesList = ConfigCenter.getInstance().get("packages") || [];
    }

    static addPackage(packageName, instance) {
        if (PackageManager.#packages.has(packageName)) {
            tools.logger.warn(`Package ${packageName} already exists`);
            return;
        }
        PackageManager.#packages.set(packageName, new Package(packageName, instance));
        tools.logger.info(`Package ${packageName} registered`);
    }

    static getPackage(packageName, options = {}) {
        const packageEntry = PackageManager.#packages.get(packageName);
        if (!packageEntry) {
            tools.logger.warn(`Package ${packageName} not found`);
            return null;
        }

        if (options.createInstance && typeof packageEntry.instance === "function") {
            return new packageEntry.instance();
        }
        return packageEntry.instance;
    }

    #registerPackage(packageInput, packageName) {
        try {
            let name;
            let customName;
            let packageInstance;
            if (typeof packageInput === "object" && packageInput.name && packageInput.path) {
                customName = packageInput.name;
                packageInstance = PackageValidator.validateFilePath(packageInput.path);
            } else if (typeof packageInput === "string" && path.isAbsolute(packageInput)) {
                packageInstance = PackageValidator.validateFilePath(packageInput);
            } else {
                packageInstance = PackageValidator.validatePackage(packageInput);
            }
            if (!packageInstance) {
                tools.logger.error(`Invalid package input`, packageInput);
                return;
            }

            name = customName || packageName || packageInput || packageInstance.name || packageInstance.constructor.name ;
            
            PackageManager.addPackage(name, packageInstance);
        } catch (error) {
            tools.logger.error(`Failed to register package`, error);
            tools.logger.error(error);
        }
    }

    registerPackages() {
        try {
            if (!this.packagesList || this.packagesList.length <= 0) {
                tools.logger.info("No packages to register.");
                return;
            }

            this.packagesList.forEach((packageInput) => {
                if (typeof packageInput === "object" && packageInput.name && packageInput.input) {
                    this.#registerPackage(packageInput.input, packageInput.name);
                } else {
                    this.#registerPackage(packageInput);
                }
            });
        } catch (error) {
            tools.logger.error(`Error while registering packages`, error);
        }
    }
}

module.exports = PackageManager;