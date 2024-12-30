const HttpLauncher = require('../adapters/http/HttpLauncher');
const RpcLauncher = require('../adapters/rpc/RpcLauncher');
const { tools } = require('../utils/ToolManager');

class MainLauncher {
    constructor() {
        this.launchers = [
            new HttpLauncher(),
            new RpcLauncher(),
        ];
    }

    start() {
        return Promise.all(this.launchers.map((launcher) => launcher.start())).then(() => {
            tools.logger.info('launchers are running.');
        });
    }

    /**
     * Stops all launchers in sequence.
     */
    stop() {
        return Promise.all(this.launchers.map((launcher) => launcher.stop())).then(() => {
            tools.logger.info('launchers are stopped.');
            process.exit(1);
        });
    }
}

module.exports = MainLauncher;
