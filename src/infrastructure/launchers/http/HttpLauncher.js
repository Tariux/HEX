const BaseLauncher = require('../base/BaseLauncher');
const HttpServer = require('../../adapters/http/HttpServer');

class HttpLauncher extends BaseLauncher {
    constructor() {
        super('HttpLauncher');
        this.httpServer = new HttpServer();
    }

    async start() {
        this.log('Starting HTTP server...');
        await this.httpServer.listen(3000);
        this.log('HTTP server is running on port 3000');
    }
}

module.exports = HttpLauncher;
