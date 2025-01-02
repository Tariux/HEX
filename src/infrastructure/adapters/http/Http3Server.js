const fs = require('fs');
const quic = require('@nodejs/quic'); const url = require('url');
const ConfigCenter = require('../../config/ConfigCenter');
const generateCertificates = require('../../../../shared/utils/generateCertificates');
const BaseServer = require('../BaseServer');
const { tools } = require('../../utils/ToolManager');

class Http3Server extends BaseServer {
    constructor(config) {
        super(config);
        this.credentials = ConfigCenter.getInstance().get('credentials');
        this.port = typeof config.ssl === 'number' ? config.ssl : config.port + 1;
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
            allowHTTP1: true,         };
    }

    #parseQueryParams(target) {
        const parsedUrl = url.parse(target, true);
        return parsedUrl.query;
    }

    listen() {
        try {
            this.#generateCertificates();
            const serverOptions = this.#createServerOptions();

            this.app = quic.createServer(serverOptions);

            this.app.on('session', (session) => {
                session.on('stream', (stream, headers) => {
                    let body = '';
                    const queryParams = this.#parseQueryParams(headers[':path']);

                    stream.on('data', (chunk) => {
                        body += chunk.toString();
                    });

                    stream.on('end', () => {
                                                let inputData = null;
                        if (headers['content-type'] === 'application/json') {
                            try {
                                inputData = JSON.parse(body);
                            } catch (error) {
                                stream.respond({
                                    ':status': 400,
                                    'content-type': 'text/plain',
                                });
                                stream.end('Invalid JSON format');
                                return;
                            }
                        }

                        this.handleIncomingRequest({ type: 'HTTP3', data: { headers }, inputData, queryParams })
                            .then((command) => {
                                const contentType = command?.dispatcher?.contentType || 'text/plain';
                                stream.respond({
                                    ':status': command?.statusCode || 400,
                                    'content-type': contentType,
                                });

                                if (contentType === 'application/json') {
                                    stream.end(JSON.stringify(command.response));
                                } else {
                                    stream.end(command.response.toString());
                                }
                            })
                            .catch((error) => {
                                stream.respond({
                                    ':status': 400,
                                    'content-type': 'text/plain',
                                });
                                stream.end(error.toString());
                            });
                    });

                    stream.on('error', (error) => {
                        stream.respond({
                            ':status': 500,
                            'content-type': 'text/plain',
                        });
                        stream.end(`Stream error: ${error.message}`);
                    });
                });
            });

            return new Promise((resolve) => {
                this.server = this.app.listen(this.port, () => {
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
            this.server.close((err) => {
                if (err) {
                    tools.logger.error(`Error stopping HTTP/3 server: ${err.message}`);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = Http3Server;
