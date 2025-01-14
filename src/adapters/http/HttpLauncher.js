const BaseLauncher = require('../BaseLauncher');
const HttpServer = require('./HttpServer');
const Http2Server = require('./Http2Server');
const Http3Server = require('./Http3Server');

class HttpLauncher extends BaseLauncher {
    servers = new Map();
    constructor(servers) {
        super('HttpLauncher');
        servers.forEach(server => {
                this.#launchServer(server);
        });
    }

    #launchServer(server) {
        if (server.type.toUpperCase() === 'QUIC') {
            this.servers.set(`${server.type}:${server.name}`, new Http3Server(server));
        } else if (server.ssl && server.ssl === true) {
            this.servers.set(`${server.type}:${server.name}`, new Http2Server(server));
        } else {
            this.servers.set(`${server.type}:${server.name}`, new HttpServer(server));
        }
    }


}

module.exports = HttpLauncher;
