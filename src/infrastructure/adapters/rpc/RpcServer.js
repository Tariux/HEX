const net = require('net'); 
const BaseServer = require('../BaseServer');

class RpcServer extends BaseServer {
    constructor(config) {
        super(config);
        this.server = net.createServer();
        this.handlers = {};
    }

    registerMethod(method, handler) {
        this.handlers[method] = handler;
    }

    listen() {
        this.server.on('connection', (socket) => {
            socket.on('data', async (data) => {
                try {
                    const request = JSON.parse(data.toString());
                    return this.handleIncomingRequest({ type: 'RPC', data: request });
                } catch (err) {
                    const errorResponse = {
                        id: null,
                        result: null,
                        error: 'Invalid request format',
                    };
                    socket.write(JSON.stringify(errorResponse));
                }
            });
        });

        return new Promise((resolve) => {
            this.server.listen(this.port, () => {
                resolve();
            });
        });
    }

    stop() {
        return new Promise((resolve) => {
            this.server.close(() => {
                resolve();
            });
        });
    }
}

module.exports = RpcServer;
