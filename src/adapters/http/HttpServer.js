const http = require('http');
const BaseServer = require('../BaseServer');
const url = require('url');

class HttpServer extends BaseServer {
    status = false;

    constructor(config) {
        super(config);
    }

    #parseQueryParams(req) {
        const baseUrl = `http://${req.headers.host}`;
        const parsedUrl = new URL(req.url, baseUrl);
        const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());
        return queryParams;
    }

    listen() {
        try {

            this.app = http.createServer((req, res) => {
                
                if (req.headers.origin) {
                    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                    res.setHeader('Access-Control-Allow-Credentials', 'true');
                }

                if (req.method === 'OPTIONS') {
                    res.writeHead(200);
                    res.end();
                    return;
                }
                const queryParams = this.#parseQueryParams(req);

                let body = '';

                req.on('data', (chunk) => {
                    body += chunk.toString();
                });

                req.on('end', () => {
                    let inputData = null;
                    if (req.headers['content-type'] === 'application/json') {
                        try {
                            inputData = JSON.parse(body);
                        } catch (error) {
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end('Invalid JSON format');
                            return;
                        }
                    }

                    this.handleIncomingRequest({ type: 'HTTP', data: req, inputData, queryParams }, res).then(command => {
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

                req.on('error', (error) => {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Request error: ${error.message}`);
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
