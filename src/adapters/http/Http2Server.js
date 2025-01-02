const http2 = require('http2');
const fs = require('fs');
const url = require('url');
const ConfigCenter = require('../../config/ConfigCenter');
const generateCertificates = require('../../../shared/utils/generateCertificates');
const BaseServer = require('../BaseServer');
const { tools } = require('../../utils/ToolManager');

class Http2Server extends BaseServer {
    constructor(config) {
        super(config);
        this.credentials = ConfigCenter.getInstance().get('credentials');
        this.port = (typeof config.ssl === 'number') ? config.ssl : config.port + 1;
    }

    #generateCertificates() {
        const cert = generateCertificates(this.credentials.keyPath, this.credentials.certPath);
        if (!cert) {
            tools.logger.error('SSL: Failed to generate certificates');
            throw new Error('Certificate generation failed');
        }
        tools.logger.info('SSL: Certificates generated successfully');
        return cert;
    }

    #createServerOptions() {
        return {
            key: fs.readFileSync(this.credentials.keyPath),
            cert: fs.readFileSync(this.credentials.certPath),
        };
    }

    #parseQueryParams(target) {
        const parsedUrl = url.parse(target, true);
        return parsedUrl.query;
    }

    listen() {
        try {
            this.#generateCertificates();
            const serverOptions = this.#createServerOptions();

            this.app = http2.createSecureServer(serverOptions, (req, res) => {
                let body = '';
                const queryParams = this.#parseQueryParams(req.url);

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

                    this.handleIncomingRequest({ type: 'HTTPS', data: req, inputData, queryParams })
                        .then((command) => {
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
                        })
                        .catch((error) => {
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
            tools.logger.error(`Error starting HTTP/2 server: ${error.message}`);
            throw error;
        }
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    tools.logger.error(`Error stopping HTTP/2 server: ${err.message}`);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = Http2Server;
