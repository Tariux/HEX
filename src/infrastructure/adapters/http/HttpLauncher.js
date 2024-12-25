const BaseLauncher = require('../BaseLauncher');
const loadHttpRoutes = require('./LoadHttpRoutes');
const HttpServer = require('./HttpServer');
const path = require('path');

class HttpLauncher extends BaseLauncher {
    constructor() {
        super('HttpLauncher');
        this.httpServer = new HttpServer();
    }

    async start() {
        const httpBasePath = path.join(__dirname, '..', '..', '..', 'application'); // Adjust path as needed
        loadHttpRoutes( this.httpServer.app, httpBasePath);
        await this.httpServer.listen(3000);
        this.log('HTTP server is running on port 3000');
    }

    async stop() {
        await this.httpServer.stop();
        this.log('HTTP server stopped.');
    }
}

module.exports = HttpLauncher;
