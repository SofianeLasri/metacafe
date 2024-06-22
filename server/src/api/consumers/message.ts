import RabbitMQ from '../infrastructure/rabbitmq';
import dotenv from 'dotenv';
import * as userService from '../services/userService';
import { Message } from '../interfaces';

dotenv.config();

async function consumeMessages() {
    const user = process.env.RABBITMQ_DEFAULT_USER!;
    const password = process.env.RABBITMQ_DEFAULT_PASS!;
    const host = process.env.RABBITMQ_HOST!;
    const port = process.env.RABBITMQ_PORT!;
    await RabbitMQ.connect("amqp://" + user + ":" + password + "@" + host + ":" + port);
    await RabbitMQ.createQueue('messages');

    await RabbitMQ.consumeMessage('messages', async (msg) => {
        if (msg !== null) {
            const messagePayload: Message = JSON.parse(msg.content.toString());
            console.log('Received message:', messagePayload);

            try {
                await userService.handleIncomingMessage(messagePayload);
            } catch (error) {
                console.error('Failed to process message:', error);
            }
        }
    });
}

consumeMessages().catch(console.error);