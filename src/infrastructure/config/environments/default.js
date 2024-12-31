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
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "password",
        "database": "my_database"
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