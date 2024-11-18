import { Injectable, OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { ProductService } from '../product/product.service';
import { PrismaService } from '../prisma/prisma.service';
import { RABBITMQ_ORDERS_QUEUE_NAME, RABBITMQ_PAYMENT_QUEUE_NAME } from '../utils/constants/rabbit-mq.constant';

@Injectable()
export class OrderConsumer implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  
  constructor(
    private readonly productService: ProductService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const connection = amqp.connect([process.env.RABBIT_MQ_URL]);
    this.channelWrapper = connection.createChannel({
      setup: async (channel: Channel) => {
        await channel.assertQueue(RABBITMQ_ORDERS_QUEUE_NAME, { durable: true });
        await channel.assertQueue(RABBITMQ_PAYMENT_QUEUE_NAME, { durable: true });
        
        await channel.consume(RABBITMQ_ORDERS_QUEUE_NAME, async (message) => {
          if (!message) return;

          try {
            const data = JSON.parse(message.content.toString());
            console.log('Received order', data);

            const { orderId, products } = data;

            for (const { product_id, quantity } of products) {
              const product = await this.productService.findOne(product_id);
              
              if (!product || product.stock < quantity) {
                throw new Error(`Stock validation failed for product ${product_id}`);
              }

              console.log('Updated order', product.stock , quantity)
              await this.productService.update(product_id, {
                stock: product.stock - quantity
              });
            }
            await this.channelWrapper.sendToQueue(
              RABBITMQ_PAYMENT_QUEUE_NAME,
              Buffer.from(JSON.stringify({
                orderId,
                amount: data.totalPaid,
                products,
              })),
              { persistent: true }
            );

           channel.ack(message);
          } catch (error) {
            console.error('Error processing message:', error);
            channel.nack(message, false, false);
          }
        });
      }
    });
  }

  async onModuleDestroy() {
    await this.channelWrapper?.close();
  }
}