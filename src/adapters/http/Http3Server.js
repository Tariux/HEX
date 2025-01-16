const fs = require('fs');
const url = require('url');
const nghttp3 = require('nghttp3');
const ConfigCenter = require('../../config/ConfigCenter');
const generateCertificates = require('../../../shared/utils/generateCertificates');
const BaseServer = require('../BaseServer');
const { tools } = require('../../utils/ToolManager');

class Http3Server extends BaseServer {
    constructor(config) {
        super(config);
        this.credentials = ConfigCenter.getInstance().get('credentials');
        this.port = typeof config.ssl === 'number' ? config.ssl : (config.port || 443) + 1;
        this.app = null;
        this.server = null;
    }

    #generateCertificates() {
        try {
            const cert = generateCertificates(this.credentials.keyPath, this.credentials.certPath);
            if (!cert) {
                throw new Error('Certificate generation failed');
            }
            tools.logger.info('SSL: Certificates generated successfully');
            return cert;
        } catch (error) {
            tools.logger.error(`SSL: ${error.message}`);
            throw error;
        }
    }

    #createServerOptions() {
        try {
            return {
                key: fs.readFileSync(this.credentials.keyPath),
                cert: fs.readFileSync(this.credentials.certPath),
                allowHTTP1: true,
            };
        } catch (error) {
            tools.logger.error(`Error reading SSL files: ${error.message}`);
            throw error;
        }
    }

    #parseQueryParams(target) {
        try {
            const parsedUrl = url.parse(target, true);
            return parsedUrl.query;
        } catch (error) {
            tools.logger.error(`Error parsing query parameters: ${error.message}`);
            return {};
        }
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
                    } catch {
                        this.#sendResponse(stream, 400, 'text/plain', 'Invalid JSON format');
                        return;
                    }
                }

                const command = await this.handleIncomingRequest({
                    type: 'HTTP3',
                    data: { headers },
                    inputData,
                    queryParams,
                });

                const contentType = command?.dispatcher?.contentType || 'text/plain';
                this.#sendResponse(stream, command?.statusCode || 200, contentType, command.response);
            } catch (error) {
                tools.logger.error(`Error processing stream: ${error.message}`);
                this.#sendResponse(stream, 500, 'text/plain', `Server error: ${error.message}`);
            }
        });

        stream.on('error', (error) => {
            tools.logger.error(`Stream error: ${error.message}`);
            this.#sendResponse(stream, 500, 'text/plain', `Stream error: ${error.message}`);
        });
    }

    #sendResponse(stream, statusCode, contentType, response) {
        const headers = {
            ':status': statusCode,
            'content-type': contentType,
        };

        try {
            stream.respond({ headers });
            stream.end(response);
        } catch (error) {
            tools.logger.error(`Error sending response: ${error.message}`);
        }
    }

    listen() {
        try {
            this.#generateCertificates();
            const serverOptions = this.#createServerOptions();

            this.app = nghttp3.createServer(serverOptions, (stream, headers) => {
                this.#handleStream(stream, headers);
            });

            this.app.on('error', (error) => {
                tools.logger.error(`HTTP/3 server error: ${error.message}`);
            });

            return new Promise((resolve) => {
                this.server = this.app.listen(this.port, () => {
                    tools.logger.info(`HTTP/3 server listening on port ${this.port}`);
                    resolve();
                });
            });
        } catch (error) {
            tools.logger.error(`Error starting HTTP/3 server: ${error.message}`);
            throw error;
        }
    }

    stop() {
        return new Promise((resolve, reject) => {
            if (!this.server) {
                resolve();
                return;
            }

            this.server.close((err) => {
                if (err) {
                    tools.logger.error(`Error stopping HTTP/3 server: ${err.message}`);
                    reject(err);
                } else {
                    tools.logger.info('HTTP/3 server stopped successfully');
                    resolve();
                }
            });
        });
    }
}

module.exports = Http3Server;
