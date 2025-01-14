const fs = require('fs');
const { createServer } = require('@socketsecurity/quic'); // Modern QUIC library
const url = require('url');
const ConfigCenter = require('../../config/ConfigCenter');
const generateCertificates = require('../../../shared/utils/generateCertificates');
const BaseServer = require('../BaseServer');
const { tools } = require('../../utils/ToolManager');

class Http3Server extends BaseServer {
    constructor(config) {
        super(config);
        this.credentials = ConfigCenter.getInstance().get('credentials');
        this.port = typeof config.ssl === 'number' ? config.ssl : config.port + 1;
        this.server = null;
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
            allowHTTP1: true, // Enable fallback to HTTP/1.1
            maxConnections: 1000, // Example of a secure connection limit
            maxHeaderListSize: 8000, // Limit headers size for security
        };
    }

    #parseQueryParams(target) {
        const parsedUrl = url.parse(target, true);
        return parsedUrl.query;
    }

    #handleStream(stream, headers) {
        let body = '';
        stream.on('data', (chunk) => {
            body += chunk.toString();
        });

        stream.on('end', async () => {
            try {
                const queryParams = this.#parseQueryParams(headers[':path'] || '');

                let inputData = null;
                if (headers['content-type'] === 'application/json') {
                    try {
                        inputData = JSON.parse(body);
                    } catch (error) {
                        this.#sendResponse(stream, 400, 'application/json', JSON.stringify({ error: 'Invalid JSON format' }));
                        return;
                    }
                }

                const command = await this.handleIncomingRequest({
                    type: 'HTTP3',
                    data: { headers },
                    inputData,
                    queryParams,
                });

                const contentType = command?.dispatcher?.contentType || 'application/json';
                this.#sendResponse(stream, command?.statusCode || 200, contentType, JSON.stringify(command.response));
            } catch (error) {
                this.#sendResponse(stream, 500, 'application/json', JSON.stringify({ error: `Server error: ${error.message}` }));
            }
        });

        stream.on('error', (error) => {
            tools.logger.error(`Stream error: ${error.message}`);
            this.#sendResponse(stream, 500, 'application/json', JSON.stringify({ error: `Stream error: ${error.message}` }));
        });
    }

    #sendResponse(stream, statusCode, contentType, response) {
        const headers = {
            ':status': statusCode,
            'content-type': contentType,
        };
        stream.respond(headers);
        stream.end(response);
    }

    async listen() {
        try {
            this.#generateCertificates();
            const serverOptions = this.#createServerOptions();

            this.server = createServer(serverOptions, (stream, headers) => {
                this.#handleStream(stream, headers);
            });

            this.server.on('error', (error) => {
                tools.logger.error(`HTTP/3 server error: ${error.message}`);
            });

            await new Promise((resolve, reject) => {
                this.server.listen(this.port, (err) => {
                    if (err) {
                        tools.logger.error(`Error starting HTTP/3 server: ${err.message}`);
                        return reject(err);
                    }
                    tools.logger.info(`HTTP/3 server listening on port ${this.port}`);
                    resolve();
                });
            });
        } catch (error) {
            tools.logger.error(`Error initializing HTTP/3 server: ${error.message}`);
            throw error;
        }
    }

    async stop() {
        if (!this.server) return;

        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    tools.logger.error(`Error stopping HTTP/3 server: ${err.message}`);
                    return reject(err);
                }
                tools.logger.info('HTTP/3 server stopped successfully');
                resolve();
            });
        });
    }
}

module.exports = Http3Server;
