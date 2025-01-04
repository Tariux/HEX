const path = require('path');

module.exports = {
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

        ],
    },
    "event": {
        "emitter": "eventemitter2"
    },
    "packages": [
        'http'
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
        myMongoDB: {
            type: 'mongodb',
            connectionString: 'mongodb://localhost:27017/mydb',
        },
        myRedis: {
            type: 'redis',
            host: 'localhost',
            port: 6379,
        },
        mySqlLite1: {
            type: 'sqlite',
            filename: './storage/db.sqlite1',
        },
        mySqlLite2: {
            type: 'sqlite',
            filename: './storage/db.sqlite2',
            initialQuery: [`
            CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            birthday_yyyy TEXT NOT NULL,
            birthday_mm TEXT NOT NULL,
            birthday_dd TEXT NOT NULL
            );
            `,
                `
            CREATE TABLE IF NOT EXISTS profiles (
            userId TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            );
            `],
        },
        myMySQL: {
            type: 'mysql',
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'mydb',
        },

    },
    "servers": [
        {
            "name": "ServerNumberOne",
            "host": "localhost",
            "port": 442,
            "type": "http",
            "ssl": true,
        },
        {
            "name": "ServerNumberTwo",
            "host": "localhost",
            "port": 80,
            "type": "http",
        },
        {
            "name": "ServerNumberThree",
            "host": "localhost",
            "port": 1000,
            "type": "http",
        },
        {
            "name": "ServerHTTP3",
            "host": "localhost",
            "port": 90,
            "type": "quic",
        },
        {
            "name": "ServerRPC",
            "host": "localhost",
            "port": 100,
            "type": "rpc",
        },
    ]
}