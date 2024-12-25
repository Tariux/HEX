const net = require('net'); // Using a simple TCP server for demonstration

class RpcServer {
    constructor() {
        this.server = net.createServer();
        this.handlers = {};
    }

    registerMethod(method, handler) {
        this.handlers[method] = handler;
    }

    listen(config) {
        this.server.on('connection', (socket) => {
            socket.on('data', async (data) => {
                try {
                    const request = JSON.parse(data.toString());
                    const { method, params, id } = request;

                    if (this.handlers[method]) {
                        const result = await this.handlers[method](params);
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
            this.server.listen(config.port, () => {
                resolve();
            });
        });
    }
}

module.exports = RpcServer;
