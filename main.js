const Application = require("./src/application/Application");
const MainLauncher = require("./src/infrastructure/adapters/MainLauncher");
const ConfigCenter = require("./src/infrastructure/config/ConfigCenter");

class HEX {
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
                console.log("[HEX] is running");
                resolve(true);
            }).catch((err) => {
                console.error('Error starting application:', err);
                reject(err);
            });
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.launcher.stop().then(() => {
                console.log("[HEX] stopped");
                resolve(true);
            }).catch((err) => {
                console.error('Error stopping application:', err);
                reject(err);
            });
        });
    }

}

// ? If you reading this, I'm sorry for the mess, lol.
// ? but i will be happy if you collaborate with me to make this project better.

module.exports = HEX;