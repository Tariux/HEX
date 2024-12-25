const BaseLauncher = require('../BaseLauncher');
const loadHttpRoutes = require('./LoadHttpRoutes');
const HttpServer = require('./HttpServer');
const path = require('path');
const ConfigCenter = require('../../config/ConfigCenter');

class HttpLauncher extends BaseLauncher {
    #config = null;
    constructor() {
        super('HttpLauncher');
        this.#config = ConfigCenter.getInstance().get('http');
        this.httpServer = new HttpServer();
    }

    async start() {
        const httpBasePath = path.join(__dirname, '..', '..', '..', 'application'); // Adjust path as needed
        loadHttpRoutes( this.httpServer.app, httpBasePath);
        await this.httpServer.listen(this.#config);
        this.log(`HTTP server is running: http://${this.#config.host}:${this.#config.port}`);
    }

    async stop() {
        await this.httpServer.stop();
        this.log('HTTP server stopped.');
    }
}

module.exports = HttpLauncher;
