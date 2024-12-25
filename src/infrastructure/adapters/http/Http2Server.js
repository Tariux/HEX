const http2 = require('http2');
const fs = require('fs');
const ConfigCenter = require('../../config/ConfigCenter');
const generateCertificates = require('../../../../shared/utils/generateCertificates');

class Http2Server {
    status = false;
    constructor() {
        this.credentials = ConfigCenter.getInstance().get('credentials');
    }

    async listen(config) {
        const cert = await generateCertificates(this.credentials.keyPath, this.credentials.certPath);
        
        if (!cert) {
            console.log(`[SSL] Failed to generated certificates`);
            return;
        } else {
            console.log(`[SSL] Certificates generated successfully`);
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
            this.status = true;
            this.server = this.app.listen(config.port, resolve);
        });
    }
    

    async stop() {
        if (this.server) {
            await new Promise((resolve, reject) => {
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
}

module.exports = Http2Server;
