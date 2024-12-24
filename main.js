const ConfigCenter = require("./src/infrastructure/config/ConfigCenter");
const MainLauncher = require("./src/infrastructure/launchers/MainLauncher");

class HEX {
    static instance = null
    constructor() {
        this.config = ConfigCenter.getInstance().init();
        this.launcher = new MainLauncher();
    }

    async launch() {
        // Run the application
        if (require.main === module) {
            const mainLauncher = new MainLauncher();
            mainLauncher.start().then((res) => {
                console.log("[HEX] is running");
            }).catch((err) => {
                console.error('Error starting application:', err);
                process.exit(1);
            });
        }
    }

}

// TODO: Change this later.

async function run() {
    const hex = new HEX();
    await hex.launch()
}

run();

// ? If you reading this, I'm sorry for the mess, lol.
// ? but i will be happy if you collaborate with me to make this project better.