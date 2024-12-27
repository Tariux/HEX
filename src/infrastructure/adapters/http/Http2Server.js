const http2 = require('http2');
const fs = require('fs');
const ConfigCenter = require('../../config/ConfigCenter');
const generateCertificates = require('../../../../shared/utils/generateCertificates');
const BaseServer = require('../BaseServer');

class Http2Server extends BaseServer {
    constructor(config) {
        super(config);
        this.credentials = ConfigCenter.getInstance().get('credentials');
        this.port = (typeof config.ssl === 'number') ? config.ssl : config.port + 1;
    }

    listen() {
        this.cert = generateCertificates(this.credentials.keyPath, this.credentials.certPath);
        if (!this.cert) {
            this.log(`[SSL] Failed to generated certificates`);
            return;
        } else {
            this.log(`[SSL] Certificates generated successfully`);
        }

        const serverOptions = {
            key: fs.readFileSync(this.credentials.keyPath),
            cert: fs.readFileSync(this.credentials.certPath),
        };

        this.app = http2.createSecureServer(serverOptions, (req, res) => {
            this.handleIncomingRequest({ type: 'HTTPS', data: req }).then(command => {
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
            this.server = this.app.listen(this.port, resolve);
        });
    }


    stop() {
        return new Promise((resolve, reject) => {
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

module.exports = Http2Server;
