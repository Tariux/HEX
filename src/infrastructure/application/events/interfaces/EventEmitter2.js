const { EventEmitter2 } = require("eventemitter2");

class EventEmitter2Interface {
    constructor() {
        if (!EventEmitter2Interface.instance) {
            this.emitter = new EventEmitter2({
                wildcard: true,
                maxListeners: 20,
            });
            EventEmitter2Interface.instance = this;
        }
        return EventEmitter2Interface.instance;
    }

    publish(event, message) {
        this.emitter.emit(event, message);
    }

    subscribe(event, callback) {
        this.emitter.on(event, callback);
    }
}

module.exports = EventEmitter2Interface;
