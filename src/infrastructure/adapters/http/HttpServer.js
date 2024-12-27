const http = require('http');
const BaseServer = require('../BaseServer');

class HttpServer extends BaseServer {
    status = false;

    constructor(config) {
        super(config);
    }

    listen() {
        try {
            this.app = http.createServer((req, res) => {
                this.handleIncomingRequest({ type: 'HTTP', data: req }).then(command => {
                    const contentType = command?.dispatcher?.contentType || 'text/plain';
                    res.writeHead(command?.statusCode || 400, { 'Content-Type': contentType });
                    switch (contentType) {
                        case 'text/json':
                            res.end(JSON.stringify(command.response));
                            break;
                        default:
                            res.end(command.response.toString());
                            break;
                    }
                }).catch((error) => {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(error.toString());
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
