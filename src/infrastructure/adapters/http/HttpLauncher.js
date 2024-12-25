const BaseLauncher = require('../BaseLauncher');
const loadHttpRoutes = require('./LoadHttpRoutes');
const HttpServer = require('./HttpServer');
const path = require('path');
const ConfigCenter = require('../../config/ConfigCenter');
const Http2Server = require('./Http2Server');

class HttpLauncher extends BaseLauncher {
    #config = null;
    constructor() {
        super('HttpLauncher');
        this.#config = ConfigCenter.getInstance().get('http');
        this.version = this.#config.version || 1;
        if (this.version === 2) {
            this.server = new Http2Server();
        } else {
            this.server = new HttpServer();
            const httpBasePath = path.join(__dirname, '..', '..', '..', 'application'); // Adjust path as needed
            loadHttpRoutes(this.server.app, httpBasePath);
        }

    }

    async start() {
        await this.server.listen(this.#config);

        if (this.server.status) {
            this.log(`HTTP/${this.version} server is running: http${(this.version === 2) ? 's' : ''}://${this.#config.host}:${this.#config.port}`);
        } else {
            this.log(`HTTP/${this.version} server failed`);
        }

    }

    async stop() {
        await this.server.stop();
        this.log('HTTP server stopped.');
    }
}

module.exports = HttpLauncher;
