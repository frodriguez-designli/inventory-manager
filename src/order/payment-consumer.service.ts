import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQService } from '../rabbit-mq/rabbit-mq.service';
import { RABBITMQ_PAYMENT_QUEUE_NAME } from '../utils/constants/rabbit-mq.constant';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class PaymentConsumer implements OnModuleInit {
  private readonly logger = new Logger(PaymentConsumer.name);
  private channelWrapper: ChannelWrapper;
  private readonly initialDelay = 1000;
  private readonly maxRetries = 3;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly productService: ProductService
  ) {}

  async onModuleInit() {
    try {
      const connection = this.rabbitMQService.getConnection();
      this.channelWrapper = connection.createChannel({
        setup: async (channel: Channel) => {
          await channel.assertQueue(RABBITMQ_PAYMENT_QUEUE_NAME, { 
            durable: true,

          });

          await this.consumePayments(channel);
        },
      });
    } catch (error) {
      this.logger.error('Failed to initialize payment consumer', error);
      throw error;
    }
  }

  private async consumePayments(channel: Channel) {
    await channel.consume(RABBITMQ_PAYMENT_QUEUE_NAME, async (message) => {
     
      if (!message) return;

      try {
        const { orderId, amount } = JSON.parse(message.content.toString());
        this.logger.log(`Processing payment for order ${orderId} with amount ${amount}`);
        
        await this.processPayment(orderId, amount);
        channel.ack(message);
        
        this.logger.log(`Successfully processed payment for order ${orderId}`);
      } catch (error) {
        const retryCount = (message.properties.headers?.retryCount || 0) + 1;
        
        if (retryCount <= this.maxRetries) {
          this.logger.warn(
            `Payment processing failed for order, attempt ${retryCount}/${this.maxRetries}`,
            error
          );
          await this.retryWithBackoff(channel, message, retryCount);
        } else {
          this.logger.error(`Payment processing failed after ${this.maxRetries} attempts`, error);
          await this.handleFailedPayment(message);
          channel.ack(message);
        }
      }
    });
  }

  private async processPayment(orderId: number, amount: number): Promise<void> {
    // Simulate payment processing with 80% success rate
    const paymentSuccess = false
    
    if (!paymentSuccess) {
      throw new Error('Payment processing failed');
    }

    await this.prisma.orders.update({
      where: { order_id: orderId },
      data: { 
        orderStatus: { connect: { order_status_id: 2 } },
       // payment_date: new Date()
      }
    });
  }

  private async retryWithBackoff(channel: Channel, message: any, retryCount: number) {
    const delay = this.initialDelay * Math.pow(2, retryCount - 1);
    
    channel.ack(message);

    await new Promise(resolve => setTimeout(resolve, delay));

    await channel.publish('', RABBITMQ_PAYMENT_QUEUE_NAME, message.content, {
      headers: { retryCount },
      expiration: delay.toString(),
    });
  }

  private async handleFailedPayment(message: any) {
    const { orderId, products } = JSON.parse(message.content.toString());
    
   const updateOrder= await this.prisma.orders.update({
      where: { order_id: orderId },
      data: {
        orderStatus: { connect: { order_status_id: 4 } },
      },
      include:{
        orderProducts:{
            include:{
                product:true
            }
        }
      }
    });

    // Restore stock for each product
    if (updateOrder.orderProducts) {
        for (const product of updateOrder.orderProducts) {
          await this.productService.update(product.product_id, {
            stock: product.product.stock + product.quantity
          });
        }
      }
  
      // Update order status to failed
      await this.prisma.orders.update({
        where: { order_id: orderId },
        data: {
          orderStatus: { connect: { order_status_id: 4 } }
        }
      });
  }

  async onModuleDestroy() {
    await this.channelWrapper?.close();
  }
}