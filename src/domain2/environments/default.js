const path = require('path');

module.exports = {
    "event": {
        "emitter": "eventemitter2"
    },
    "commandsPath": [
        path.join(__dirname, "../commands")
    ],
    "eventsPath": [
    ],
    "servicesPath": [
    ],
    "middlewaresPath": [
    ],
    "database": {
    },
    "servers" : [
        {
            "name": "serverdump",
            "host": "localhost",
            "port": 82,
            "type": "http",
        }
    ]
}