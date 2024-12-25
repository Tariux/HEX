const fs = require('fs');
const path = require('path');

function loadHttpRoutes(app, basePath) {
    const protocols = ['public', 'private'];
    protocols.forEach((type) => {
        const routesPath = path.join(basePath,'http', type, 'routes');
        fs.readdirSync(routesPath).forEach((file) => {
            const route = require(path.join(routesPath, file));
            app.use(route.path, route.router);
        });
    });
}

module.exports = loadHttpRoutes;
