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
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>Hello, HTTP/2!</h1>');
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
