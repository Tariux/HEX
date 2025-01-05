const path = require('path');
const sqliteIntitalQueryConfig = require('./configs/sqliteIntitalQueryConfig');

module.exports = {
    "timeout": 5000,
    "blacklist": {
        "routes": [
            {
                type: 'REQUEST',
                protocol: 'HTTP',
                method: 'GET',
                target: '/favicon.ico',
            }
        ],
        "ip": [
            // soon as possible.
        ],
    },
    "event": {
        "emitter": "eventemitter2"
    },
    "packages": [
        {
            path:path.join(__dirname, "../packages/hash.js"),
            name: 'hash-package'
        }
    ],
    "commandsPath": [
        path.join(__dirname, "../commands")
    ],
    "eventsPath": [
        path.join(__dirname, "../events")
    ],
    "servicesPath": [
        {
            path: path.join(__dirname, "../services"),
            namespace: "domain.services"
        }
    ],
    "middlewaresPath": [
        path.join(__dirname, "../middlewares")
    ],
    "database": {
        user_db: {
            type: 'sqlite',
            filename: './storage/user_db.sqlite1',
            initialQuery: sqliteIntitalQueryConfig,
        },
    },
    "servers": [
        {
            "name": "secure-server",
            "host": "localhost",
            "port": 442,
            "type": "http",
            "ssl": true,
        },
        {
            "name": "http-server",
            "host": "localhost",
            "port": 80,
            "type": "http",
        },
        {
            "name": "mock-http-server",
            "host": "localhost",
            "port": 8008,
            "type": "http",
        }
    ]
}