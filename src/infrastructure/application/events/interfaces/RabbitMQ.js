const amqp = require("amqplib");

class RabbitMQInterface {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await amqp.connect("amqp://localhost");
            this.channel = await this.connection.createChannel();
        }
    }

    async publish(queue, message) {
        await this.connect();
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async subscribe(queue, callback) {
        await this.connect();
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.consume(queue, (msg) => {
            if (msg) {
                callback(JSON.parse(msg.content.toString()));
                this.channel.ack(msg);
            }
        });
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
            this.channel = null;
        }
    }
}

module.exports = RabbitMQInterface;
