const ConfigCenter = require("../../config/ConfigCenter");
const { tools } = require("../../utils/ToolManager");

class EventManager {
    static #instance = null;

    constructor() {
        if (EventManager.#instance) {
            return EventManager.#instance;
        }
        this.config = ConfigCenter.getInstance().get('event');
        this.type = this.config.emitter || "eventemitter2"; 
        this.emitter = this.#initializeEmitter(this.type);
        tools.logger.info(`${this.type} event manager created`);
        EventManager.#instance = this;
    }

    #initializeEmitter(type) {
        switch (type) {
            case "eventemitter2":
                const EventEmitter2Interface = require("./interfaces/EventEmitter2");
                return new EventEmitter2Interface();
            case "kafka":
                const KafkaInterface = require("./interfaces/Kafka");
                return new KafkaInterface();
            case "mq":
                const RabbitMQInterface = require("./interfaces/RabbitMQ");
                return new RabbitMQInterface();
            default:
                throw new Error(`[EventManager] Unsupported event system type: ${type}`);
        }
    }

    static getInstance() {
        if (!EventManager.#instance) {
            EventManager.#instance = new EventManager();
        }
        return EventManager.#instance;
    }
}

module.exports = EventManager;
