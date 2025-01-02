const { Kafka } = require("kafkajs");

class KafkaInterface {
    constructor() {
        const kafka = new Kafka({
            clientId: "my-app",
            brokers: ["localhost:9092"],
        });
        this.producer = kafka.producer();
        this.consumer = kafka.consumer({ groupId: "command-group" });
    }

    async publish(topic, message) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }

    async subscribe(topic, callback) {
        await this.consumer.subscribe({ topic });
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                callback(JSON.parse(message.value.toString()));
            },
        });
    }
}

module.exports = KafkaInterface;
