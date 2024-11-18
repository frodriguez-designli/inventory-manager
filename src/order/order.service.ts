import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RABBITMQ_ORDERS_QUEUE_NAME } from 'src/utils/constants/rabbit-mq.constant';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private channelWrapper: ChannelWrapper;
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly rabbitMQService: RabbitMQService,
  ) {
    const connection = amqp.connect([process.env.RABBIT_MQ_URL]);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue(RABBITMQ_ORDERS_QUEUE_NAME, {
          durable: true,
        });
      },
    });
  }

  async create(createOrderDto: CreateOrderDto) {
    const { customer_id, order_type, payment_type, products } = createOrderDto;

    // Calculate total price and ensure stock validation (synchronous part)
    let totalPaid = 0;

    for (const { product_id, quantity } of products) {
      const product = await this.productService.findOne(product_id);

      if (!product) {
        throw new BadRequestException(
          `Product with ID ${product_id} not found`,
        );
      }

      if (product.stock < quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ID ${product_id}`,
        );
      }

      totalPaid += product.price.toNumber() * quantity;
    }

    // Create the order in the database with "Pending" status
    const order = await this.prisma.orders.create({
      data: {
        customer: { connect: { customer_id } },
        order_date: new Date(),
        orderStatus: { connect: { order_status_id: 1 } }, // Pending status
        orderType: { connect: { order_type } },
        paymentType: { connect: { payment_type } },
        total_paid: totalPaid,
        orderProducts: {
          create: products.map((product) => ({
            product: { connect: { product_id: product.product_id } },
            quantity: product.quantity,
            shipment_date: new Date(),
          })),
        },
      },
      include: {
        orderProducts: true,
      },
    });
    // Publish order details to the RabbitMQ queue for further processing
    // Get the client and emit the order to the queue
    const client = this.rabbitMQService.getClient(RABBITMQ_ORDERS_QUEUE_NAME);

    try {
      this.logger.log(
        `Emitting order ${order.order_id} to the RabbitMQ queue.`,
      );

      await this.channelWrapper.sendToQueue(
        RABBITMQ_ORDERS_QUEUE_NAME,
        Buffer.from(
          JSON.stringify({
            orderId: order.order_id,
            customer_id,
            products,
            totalPaid,
          }),
        ),
        {
          persistent: true,
        },
      );

      this.logger.log(
        `Order ${order.order_id} successfully emitted to the queue.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to emit order ${order.order_id} to the queue`,
        error,
      );
      throw new BadRequestException(
        `Failed to send order to processing queue.`,
      );
    }

    return {
      message: 'Order placed successfully. Processing initiated.',
      orderId: order.order_id,
    };
  }
  findAll() {
    return this.prisma.orders.findMany();
  }

  findOne(id: number) {
    return this.prisma.orders.findUnique({
      where: {
        order_id: id,
      },
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
