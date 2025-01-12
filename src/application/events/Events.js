const ConfigCenter = require("../../config/ConfigCenter");
const { tools } = require("../../utils/ToolManager");
const LoaderResolver = require("../loader/LoaderResolver");
const EventManager = require("./EventManager");

class Events {
    static publish = (eventName, data) => {
        tools.logger.warn(`still event publisher not initilized.`, eventName);
    };

    constructor() {
        this.eventsPath = ConfigCenter.getInstance().get("eventsPath") || false;
        this.emitter = EventManager.getInstance().emitter;
    }

    registerEvents() {
        try {
            const files = LoaderResolver.getFiles(this.eventsPath);
            files.forEach((file) => this.#registerEvent(file));
            Events.publish = (eventName, data, response = false) => {
                if (response && typeof response === 'function') {
                    EventManager.getInstance().emitter.subscribe(`EVENT:${eventName}:RESPONSE`, (incoming) => {
                        response(incoming);
                    });
                    EventManager.getInstance().emitter.publish(`EVENT:${eventName}`, { ...data, __response: true });
                } else {
                    EventManager.getInstance().emitter.publish(`EVENT:${eventName}`, data);
                }
            };
        } catch (error) {
            tools.logger.error(`error while registering events`);
            tools.logger.error(error);
        }
    }

    #registerEvent(filePath) {
        try {
            const eventClass = LoaderResolver.loadJsFile(filePath);
            if (
                !eventClass &&
                !this.#validateEventOptions(eventClass?.eventOptions)
            ) {
                tools.logger.warn(`invalid event file`, filePath);
                return;
            }
            const eventInstance = LoaderResolver.createInstanceAndLoad(
                eventClass,
                eventClass?.eventOptions?.loader
            );
            if (!eventInstance || typeof eventInstance.handle !== "function") {
                tools.logger.warn(
                    `failed to create event instance from or handle function not found in event`,
                    filePath
                );
                return;
            }
            const eventName = eventClass.eventOptions.eventName;
            const eventKey = `EVENT:${eventName}`;
            this.emitter.subscribe(eventKey, (data) => {
                try {
                    if (data.__response && data.__response === true) {
                        const response = eventInstance.handle(data);
                        EventManager.getInstance().emitter.publish(`EVENT:${eventName}:RESPONSE`, response);
                    } else {
                        return eventInstance.handle(data);
                    }
                    tools.logger.info(`+ event published: ${`EVENT:${eventName}`}`);
                } catch (error) {
                    tools.logger.error(`- publish to event ${eventName} failed`);
                    tools.logger.error(error);
                }
            });
            tools.logger.info(`event loaded for pattern: ${eventKey}`);
        } catch (error) {
            tools.logger.error(`failed to register event from`, filePath);
            tools.logger.error(error);
        }
    }

    #validateEventOptions(options) {
        return options?.eventName && options?.type;
    }
}

module.exports = Events;
