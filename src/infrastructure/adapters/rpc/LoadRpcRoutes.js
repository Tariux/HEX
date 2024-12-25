const fs = require('fs');
const path = require('path');

function loadRpcRoutes(rpcServer, basePath) {
    const protocols = ['public', 'private'];

    protocols.forEach((type) => {
        const routesPath = path.join(basePath, 'rpc', type, 'routes');
        const handlersPath = path.join(basePath, 'rpc',type, 'handlers');

        fs.readdirSync(routesPath).forEach((file) => {
            const route = require(path.join(routesPath, file));

            const handlerFilePath = path.join(handlersPath, `${path.parse(file).name}.handler.js`);
            const handler = require(handlerFilePath);

            rpcServer.registerMethod(route.method, handler);
        });
    });
}

module.exports = loadRpcRoutes;
