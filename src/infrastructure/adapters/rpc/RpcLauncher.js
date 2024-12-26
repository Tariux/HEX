const ConfigCenter = require('../../config/ConfigCenter');
const BaseLauncher = require('../BaseLauncher');
const RpcServer = require('./RpcServer');

class RpcLauncher extends BaseLauncher {
    #config = null;
    servers = new Map();
    constructor() {
        super('RpcLauncher');
        this.#config = ConfigCenter.getInstance().get('rpc');
        this.servers.set('rpc' , new RpcServer(this.#config))
    }

}

module.exports = RpcLauncher;
