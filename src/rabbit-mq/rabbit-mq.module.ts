import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbit-mq.service';

@Global() // Make this module globally available
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBIT_MQ_URL],
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService, ClientsModule],
})
export class RabbitMQModule {}
