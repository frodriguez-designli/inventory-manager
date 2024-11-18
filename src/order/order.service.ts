import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';
import { OrderStatusService } from 'src/order-status/order-status.service';
import { OrderStatusEnum } from 'src/utils/enum/order';

@Injectable()
export class OrderService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly orderStatusService: OrderStatusService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const orderStatus = await this.orderStatusService.findOneByName(OrderStatusEnum.PENDING);
    const { customer_id, order_type, payment_type, products } = createOrderDto;

    let totalPaid = 0;

    // Begin a transaction to ensure all database changes happen together
    const order = await this.prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.orders.create({
        data: {
          customer: { connect: { customer_id } },
          order_date: new Date(),
          orderStatus: { connect: { order_status_id: orderStatus.order_status_id } },
          orderType: { connect: { order_type } },
          paymentType: { connect: { payment_type } },
          total_paid: totalPaid,
        },
      });

      // Process each product in the order
      for (const { product_id, quantity } of products) {
        const product = await this.productService.findOne(product_id);

        if (!product) {
          throw new BadRequestException(`Product with ID ${product_id} not found`);
        }

        if (product.stock < quantity) {
          throw new BadRequestException(`Insufficient stock for product ID ${product_id}`);
        }

        // Deduct stock
        await prisma.products.update({
          where: { product_id },
          data: { stock: product.stock - quantity },
        });

        // Update total paid
        totalPaid += product.price.toNumber() * quantity;

        // Create orderProducts entry
        await prisma.orderProducts.create({
          data: {
            product_id,
            order_id: newOrder.order_id,
            shipment_date: new Date(),
          },
        });
      }

      // Update total_paid for the order and change order status to "Paid"
      const updatedOrder = await prisma.orders.update({
        where: { order_id: newOrder.order_id },
        data: {
          total_paid: totalPaid,
          orderStatus: { connect: { order_status_id: 2 } },  // Assuming 2 is "Paid"
        },
      });

      return updatedOrder;
    });

    return order;
  }

  async completeOrder(orderId: number) {
    const completedStatus = await this.orderStatusService.findOneByName(OrderStatusEnum.DELIVERED);

    // Update the order status to "Completed"
    const updatedOrder = await this.prisma.orders.update({
      where: { order_id: orderId },
      data: {
        orderStatus: { connect: { order_status_id: completedStatus.order_status_id } },
      },
    });

    return updatedOrder;
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
