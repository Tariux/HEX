const HttpLauncher = require('../adapters/http/HttpLauncher');
const RpcLauncher = require('../adapters/rpc/RpcLauncher');

class MainLauncher {
    constructor() {
        this.launchers = [
            new HttpLauncher(),
            new RpcLauncher(),
        ];
    }

    start() {
        console.log('[Launcher] Starting services...');
        return Promise.all(this.launchers.map((launcher) => launcher.start())).then(() => {
            console.log('[Launcher] services are running.');
        });
    }

    /**
     * Stops all launchers in sequence.
     */
    stop() {
        console.log('[Launcher] Stopping services...' );
        return Promise.all(this.launchers.map((launcher) => launcher.stop())).then(() => {
            console.log('[Launcher] services stopped.');
            process.exit(1);
        });
    }
}

module.exports = MainLauncher;
