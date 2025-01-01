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
            filename: 'db.sqlite1',
        },
        mySqlLite2: {
            type: 'sqlite',
            filename: 'db.sqlite2',
            initialQuery: [`
            CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY, -- UUID for the user
            birthday_yyyy TEXT NOT NULL, -- Birthday year
            birthday_mm TEXT NOT NULL, -- Birthday month
            birthday_dd TEXT NOT NULL -- Birthday day
            );
            `,
            `
            CREATE TABLE IF NOT EXISTS profiles (
            userId TEXT PRIMARY KEY, -- Links to the users table
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
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