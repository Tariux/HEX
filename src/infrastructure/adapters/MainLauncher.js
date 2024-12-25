const HttpLauncher = require('../adapters/http/HttpLauncher');
const RpcLauncher = require('../adapters/rpc/RpcLauncher');

class MainLauncher {
    constructor() {
        this.launchers = [
            new HttpLauncher(),
            new RpcLauncher(),
        ];
    }

    /**
     * Starts all launchers in parallel.
     */
    async start() {
        console.log('[All] Starting services...');
        await Promise.all(this.launchers.map((launcher) => launcher.start()));
        console.log('[All] services are running.');
    }

    /**
     * Stops all launchers in sequence.
     */
    async stop() {
        console.log('Stopping all services...');
        for (const launcher of this.launchers) {
            if (launcher.stop) {
                await launcher.stop();
            }
        }
        console.log('All services stopped.');
    }
}

module.exports = MainLauncher;
