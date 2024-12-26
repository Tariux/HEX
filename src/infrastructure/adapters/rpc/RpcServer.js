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
                    const { id, method, params } = request;

                    const command = this.handleIncomingRequest({ type: 'RPC', data: request });

                    if (this.handlers[command.method]) {
                        const result = await this.handlers[command.method](command.parameters);
                        const response = { id, result, error: null };
                        socket.write(JSON.stringify(response));
                    } else {
                        const errorResponse = {
                            id,
                            result: null,
                            error: `Method ${method} not found`,
                        };
                        socket.write(JSON.stringify(errorResponse));
                    }
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
