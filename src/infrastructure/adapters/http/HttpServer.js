const express = require('express');

class HttpServer {
    constructor() {
        this.app = express();        
    }

    async listen(config) {
        return new Promise((resolve) => {
            this.server = this.app.listen(config.port, resolve);
        });
    }

    async stop() {
        if (this.server) {
            await new Promise((resolve, reject) => {
                this.server.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }
}

module.exports = HttpServer;
