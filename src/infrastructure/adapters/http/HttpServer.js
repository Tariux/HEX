const http = require('http');
const BaseServer = require('../BaseServer');
const { response } = require('express');

class HttpServer extends BaseServer {
    status = false;

    constructor(config) {
        super(config);
    }

    listen() {

        try {
            this.app = http.createServer((req, res) => {
                this.handleIncomingRequest({ type: 'HTTP', data: req }).then(response => {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(response);
                });
            });

            return new Promise((resolve) => {
                this.server = this.app.listen(this.port, () => {
                    resolve();
                });
            });
        } catch (error) {
            this.error(`Error starting HTTP server: ${error.message}`);
            throw error;
        }
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    this.error(`Error stopping HTTP server: ${err.message}`);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = HttpServer;
