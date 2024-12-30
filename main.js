const MainLauncher = require("./src/infrastructure/adapters/MainLauncher");
const Application = require("./src/infrastructure/application/Application");
const ConfigCenter = require("./src/infrastructure/config/ConfigCenter");
const { tools } = require("./src/infrastructure/utils/ToolManager");

class hex {
    static instance = null
    constructor() {
        this.config = ConfigCenter.getInstance().init();
        this.launcher = new MainLauncher();
        this.application = new Application();
    }

    launch() {
        return new Promise((resolve, reject) => {
            this.launcher.start().then(() => {
                this.application.run();
                tools.logger.info("hex is running");
                resolve(true);
            }).catch((error) => {
                tools.logger.error('Error starting application:');
                tools.logger.error(error);
                reject(error);
            });
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.launcher.stop().then(() => {
                tools.logger.info("[hex] stopped");
                resolve(true);
            }).catch((error) => {
                tools.logger.error('Error stopping application');
                tools.logger.error(error);
                reject(error);
            });
        });
    }
}

// ? If you reading this, I'm sorry for the mess, lol.
// ? but i will be happy if you collaborate with me to make this project better.

module.exports = hex;