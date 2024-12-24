const BaseLauncher = require('../base/BaseLauncher');
const RpcServer = require('../../adapters/rpc/RpcServer');

class RpcLauncher extends BaseLauncher {
    constructor() {
        super('RpcLauncher');
        this.rpcServer = new RpcServer();
    }

    async start() {
        this.log('Starting RPC server...');
        this.rpcServer.registerMethod('add', async ({ a, b }) => a + b);
        this.rpcServer.registerMethod('subtract', async ({ a, b }) => a - b);
        await this.rpcServer.listen(4000);
        this.log('RPC server is running on port 4000');
    }
}

module.exports = RpcLauncher;
