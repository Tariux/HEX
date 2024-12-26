const BaseLauncher = require('../BaseLauncher');
const HttpServer = require('./HttpServer');
const ConfigCenter = require('../../config/ConfigCenter');
const Http2Server = require('./Http2Server');

class HttpLauncher extends BaseLauncher {
    #config = null;
    servers = new Map();
    constructor() {
        super('HttpLauncher');
        this.#config = ConfigCenter.getInstance().get('http');
        this.ssl = this.#config.ssl || false;
        this.servers.set('http' , new HttpServer(this.#config))
        if (this.ssl) this.servers.set('https' , new Http2Server(this.#config));
    }

}

module.exports = HttpLauncher;
