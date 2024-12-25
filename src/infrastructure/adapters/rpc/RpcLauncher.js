const BaseLauncher = require('../BaseLauncher');
const loadRpcRoutes = require('./LoadRpcRoutes');
const RpcServer = require('./RpcServer');
const path = require('path');

class RpcLauncher extends BaseLauncher {
    constructor() {
        super('RpcLauncher');
        this.rpcServer = new RpcServer();
    }

    async start() {
        const rpcServer = new RpcServer();
        const rpcBasePath = path.join(__dirname, '..', '..', '..', 'application'); // Adjust path as needed
        loadRpcRoutes(rpcServer, rpcBasePath);
        await rpcServer.listen(5000);
        this.log('RPC Server is running on port 5000');
    }
    
}

module.exports = RpcLauncher;
