import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderStatusEnum } from 'src/utils/enum/order';

@Injectable()
export class PaymentConsumer{
  private readonly maxRetries = 5; // Maximum retries for payment
  private readonly initialBackoff = 1000; // Initial delay in milliseconds

  constructor(private readonly prisma: PrismaService) {}

  @MessagePattern('process_payment')
  async handlePayment(@Payload() data: { orderId: number }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const { orderId } = data;

      // Simulate payment success or failure
      const paymentSuccess = Math.random() > 0.7; // 30% chance of success

      if (!paymentSuccess) {
        throw new Error('Payment failed');
      }

      // Payment succeeded: Update order status to "Paid"
      await this.prisma.orders.update({
        where: { order_id: orderId },
        data: {
          orderStatus: { connect: { order_status_id: 2 } },
        },
      });

      console.log(`Payment successful for order ${orderId}`);
    } catch (error) {
      const retries = this.getRetryCount(message);

      if (retries >= this.maxRetries) {
        console.log(`Payment failed after ${retries} retries, restoring stock`);

        await this.restoreStock(data.orderId);

        await this.prisma.orders.update({
          where: { order_id: data.orderId },
          data: {
            orderStatus: { connect: { order_status_id: 2 } },
          },
        });
      } else {
        console.log(`Retrying payment, attempt #${retries + 1}`);
        await this.scheduleRetry(data, retries + 1, channel, message);
      }
    } finally {
      // Acknowledge the message
      channel.ack(message);
    }
  }

  private getRetryCount(message: any): number {
    const headers = message.properties.headers || {};
    return headers['x-retry-count'] || 0;
  }

  private async scheduleRetry(
    data: { orderId: number },
    retryCount: number,
    channel: any,
    originalMessage: any,
  ) {
    // Exponential backoff
    const delay = this.initialBackoff * Math.pow(2, retryCount);

    // Add retry count as a custom header
    channel.sendToQueue(
      originalMessage.fields.routingKey, // Requeue to the same queue
      Buffer.from(JSON.stringify(data)),
      {
        headers: { 'x-retry-count': retryCount },
        expiration: delay.toString(), // Optional: Message expiration for delayed retries
      },
    );
  }

  private async restoreStock(orderId: number) {
    const order = await this.prisma.orders.findUnique({
      where: { order_id: orderId },
      include: { orderProducts: {
        include: { product: true, order:true }
      } },
    });

    for (const product of order.orderProducts) {
      await this.prisma.products.update({
        where: { product_id: product.product_id },
        data: { stock: { increment: product.quantity} },
      });
    }
  }
}
