const path = require('path');

module.exports = {
    "commandsPath": [
        path.join(__dirname, "../../../domain/commands")
    ],
    "eventsPath": [
        path.join(__dirname, "../../../domain/events")
    ],
    "servicesPath": [
        {
            path: path.join(__dirname, "../../../domain/services"),
            namespace: "domain.services"
        }
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
            filename: 'db.sqlite',
        },
        mySqlLite2: {
            type: 'sqlite',
            filename: 'db.sqlite',
        },
        myMySQL: {
            type: 'mysql',
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'mydb',
        },

    },
    "event": {
        "emitter": "eventemitter2"
    },
    "rpc": {
        "host": "localhost",
        "port": 50051
    },
    "http": {
        "host": "localhost",
        "port": 3000
    }
}