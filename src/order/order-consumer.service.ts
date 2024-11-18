import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderConsumer {
  private readonly logger = new Logger(OrderConsumer.name);

  constructor(
    private readonly productService: ProductService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @EventPattern('process_order')
  async handleOrder(@Payload() data: any, context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      this.logger.log(`Received order processing request: ${JSON.stringify(data)}`);

      const { orderId, products } = data;

      // Deduct stock for each product in the order
      for (const { productId, quantity } of products) {
        const product = await this.productService.findOne(productId);
        if (!product) {
          throw new Error(`Product with ID ${productId} not found.`);
        }

        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for product ID ${productId}.`);
        }

        // Deduct stock
        await this.productService.update(productId, {stock:product.stock - quantity});
      }

      // Simulate payment process by publishing a message to the payments queue
      const paymentQueue = 'payments_queue';
      const paymentMessage = {
        orderId,
        amount: data.totalPrice,
      };

      const paymentClient = this.rabbitMQService.getClient(paymentQueue);
      await paymentClient.emit('process_payment', paymentMessage).toPromise();

      this.logger.log(`Order ${orderId} successfully processed. Sent to payment queue.`);
      
      // Acknowledge the message
      channel.ack(message);
    } catch (error) {
      this.logger.error(`Failed to process order: ${error.message}`, error.stack);

      // Reject the message without requeueing
      channel.nack(message, false, false);
    }
  }
}
