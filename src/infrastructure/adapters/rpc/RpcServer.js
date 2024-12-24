const net = require('net'); // Using a simple TCP server for demonstration

class RpcServer {
    constructor() {
        this.server = net.createServer();
        this.handlers = {};
    }

    /**
     * Registers a handler for an RPC method
     * @param {string} method - The RPC method name
     * @param {function} handler - The function to handle the RPC method
     */
    registerMethod(method, handler) {
        this.handlers[method] = handler;
    }

    /**
     * Starts the RPC server
     * @param {number} port - Port to listen on
     */
    listen(port) {
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
            this.server.listen(port, () => {
                // console.log(`RPC Server is running on port ${port}`);
                resolve();
            });
        });
    }
}

module.exports = RpcServer;
