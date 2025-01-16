const HttpLauncher = require('../adapters/http/HttpLauncher');
const RpcLauncher = require('../adapters/rpc/RpcLauncher');
const ConfigCenter = require('../config/ConfigCenter');
const { tools } = require('../utils/ToolManager');

class MainLauncher {
    launchers = []
    constructor() {
        this.config = ConfigCenter.getInstance().get('servers');
        this.servers = tools.helper.groupBy(Object.values(this.config), 'type');
        if (this.servers.http) {
          this.launchers.push(new HttpLauncher([...this.servers.http || [], ...this.servers.quic || []]))  
        } 
        if (this.servers.rpc) {
            this.launchers.push(new RpcLauncher(this.servers.rpc))  
        }
        if (this.servers.quic) {
            // this.launchers.push(new QuicLauncher(this.servers.quic))  
        }
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
            // process.exit(1);
            return;
        });
    }
}

module.exports = MainLauncher;
