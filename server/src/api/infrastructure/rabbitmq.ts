import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';

class RabbitMQ {
    private static connection: Connection;
    private static channel: Channel;
    private static url: string;

    public static async connect(url: string): Promise<void> {
        if (!this.connection) {
            this.url = url;
            this.connection = await amqp.connect(this.url);
            this.channel = await this.connection.createChannel();
            console.log('Connected to RabbitMQ');
        }
    }

    public static async createQueue(queue: string): Promise<void> {
        await this.channel.assertQueue(queue, { durable: true });
    }

    public static async sendMessage(queue: string, message: string): Promise<void> {
        await this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
        console.log(`Message sent to queue ${queue}: ${message}`);
    }

    public static async consumeMessage(queue: string, callback: (msg: ConsumeMessage | null) => void): Promise<void> {
        await this.channel.consume(queue, callback, { noAck: true });
    }

    public static async close(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
        console.log('Disconnected from RabbitMQ');
    }
}

export default RabbitMQ;