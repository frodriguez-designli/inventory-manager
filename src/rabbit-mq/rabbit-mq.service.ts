import { Injectable } from '@nestjs/common';

import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  private clients: Record<string, ClientProxy> = {};

  constructor() {}

  getClient(queueName: string): ClientProxy {
    if (!this.clients[queueName]) {
      this.clients[queueName] = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: queueName,
          queueOptions: { durable: true },
        },
      });
    }
    return this.clients[queueName];
  }
}
