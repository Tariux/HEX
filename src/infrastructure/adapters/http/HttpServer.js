const http = require('http');
const fs = require('fs');
const ConfigCenter = require('../../config/ConfigCenter');

class HttpServer {
    status = false;

    constructor(config) {
        this.port = typeof config.port === 'number' ? config.port : 8080;
    }

    async listen() {
        try {
            this.app = http.createServer((req, res) => {
                // Basic request handling
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Hello, HTTP!');
            });

            return new Promise((resolve) => {
                this.status = true;
                this.server = this.app.listen(this.port, () => {
                    console.log(`HTTP Server running on port ${this.port}`);
                    resolve();
                });
            });
        } catch (error) {
            console.error(`Error starting HTTP server: ${error.message}`);
            throw error;
        }
    }

    async stop() {
        if (this.server) {
            await new Promise((resolve, reject) => {
                this.server.close((err) => {
                    if (err) {
                        console.error(`Error stopping HTTP server: ${err.message}`);
                        reject(err);
                    } else {
                        console.log('HTTP Server stopped successfully.');
                        resolve();
                    }
                });
            });
        }
    }
}

module.exports = HttpServer;
