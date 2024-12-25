const ConfigCenter = require('../../config/ConfigCenter');
const BaseLauncher = require('../BaseLauncher');
const loadRpcRoutes = require('./LoadRpcRoutes');
const RpcServer = require('./RpcServer');
const path = require('path');

class RpcLauncher extends BaseLauncher {
    #config = null;
    constructor() {
        super('RpcLauncher');
        this.#config = ConfigCenter.getInstance().get('rpc');
        this.rpcServer = new RpcServer();
    }

    async start() {
        const rpcServer = new RpcServer();
        const rpcBasePath = path.join(__dirname, '..', '..', '..', 'application'); // Adjust path as needed
        loadRpcRoutes(rpcServer, rpcBasePath);
        await rpcServer.listen(this.#config);
        this.log(`RPC Server is running on port ${this.#config.port}`);
    }
    
}

module.exports = RpcLauncher;
