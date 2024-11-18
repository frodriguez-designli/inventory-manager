import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private clients: Record<string, ClientProxy> = {};
  private connection: AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;

  constructor() {
    this.connection = amqp.connect([process.env.RABBIT_MQ_URL]);
  }

  onModuleInit() {
    this.logger.log('RabbitMQService initialized.');
  }

  getConnection(): AmqpConnectionManager {
    return this.connection;
  }

  getClient(queueName: string): ClientProxy {
    if (!this.clients[queueName]) {
      this.clients[queueName] = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL],
          queue: queueName,
          queueOptions: { durable: true },
        },
      });
      
      this.clients[queueName].connect().then(() => {
        this.logger.log(`Successfully connected to RabbitMQ queue: ${queueName}`);
      }).catch((err) => {
        this.logger.error(`Failed to connect to RabbitMQ queue: ${queueName}`, err);
      });
    }
    return this.clients[queueName];
  }

  async onModuleDestroy() {
    await this.connection?.close();
  }
}