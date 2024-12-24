const express = require('express');

class HttpServer {
    constructor() {
        this.app = express();
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.get('/health', (req, res) => {
            res.status(200).send('OK');
        });
        // TODO: Add other routes later for test
    }

    async listen(port) {
        return new Promise((resolve) => {
            this.app.listen(port, resolve);
        });
    }
}

module.exports = HttpServer;
