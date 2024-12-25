const BaseLauncher = require('../BaseLauncher');
const loadHttpRoutes = require('./LoadHttpRoutes');
const HttpServer = require('./HttpServer');
const path = require('path');
const ConfigCenter = require('../../config/ConfigCenter');
const Http2Server = require('./Http2Server');

class HttpLauncher extends BaseLauncher {
    #config = null;
    #servers = new Map();
    constructor() {
        super('HttpLauncher');
        this.#config = ConfigCenter.getInstance().get('http');
        this.ssl = this.#config.ssl || false;
        this.version = (this.#config.ssl) ? 2 : 1;
        this.#servers.set('http' , HttpServer)
        if (this.ssl) this.#servers.set('https' , Http2Server);
    }

    async start() {
        Promise.all(this.#servers.values().map((instance) => {
            new instance().listen(this.#config);
        })).then(() => {
            if (this.ssl) {
                this.log(`HTTP/2 server: https://${this.#config.host}:${(typeof this.#config.ssl === 'number') ? this.#config.ssl : this.#config.port + 1}`);
            }
            this.log(`HTTP/1 server: http://${this.#config.host}:${this.#config.port}`);
        }).catch((err) => {
            this.log(`HTTP/${this.version} server failed`, err);
        });

    }

    async stop() {
        await this.server.stop();
        this.log('HTTP server stopped.');
    }
}

module.exports = HttpLauncher;
