import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class OrderService {

  constructor(private readonly prisma: PrismaService, private readonly productService: ProductService,) {}
  async create(createOrderDto: CreateOrderDto) {
    const { customer_id, order_type, payment_type, order_status_id, products } = createOrderDto;

    // Calculate total price for the order
    let totalPaid = 0;

    // Begin a transaction to ensure all database changes happen together
    const order = await this.prisma.$transaction(async (prisma) => {
      // Create the order (without orderProducts first)
      const newOrder = await prisma.orders.create({
        data: {
          customer: { connect: { customer_id } },
          order_date: new Date(),
          orderStatus: { connect: { order_status_id } },
          orderType: { connect: { order_type } },
          paymentType: { connect: { payment_type } },
          total_paid: totalPaid, // Will update after processing products
        },
      });

      // Loop through each product in the order
      for (const { product_id, quantity } of products) {
        const product = await this.productService.findOne(product_id);

        // Check if the product exists
        if (!product) {
          throw new BadRequestException(`Product with ID ${product_id} not found`);
        }

        // Check if there's sufficient stock
        if (product.stock < quantity) {
          throw new BadRequestException(`Insufficient stock for product ID ${product_id}`);
        }

        // Deduct the stock for the product
        await prisma.products.update({
          where: { product_id },
          data: { stock: product.stock - quantity },
        });

        // Add the product price * quantity to the total paid
        totalPaid += product.price.toNumber() * quantity;

        // Create the orderProducts entry
        await prisma.orderProducts.create({
          data: {
            product_id,
            order_id: newOrder.order_id, // Correctly associate with the newly created order
            shipment_date: new Date(),
          },
        });
      }

      // Update the order with the correct total_paid after creating all products
      const updatedOrder = await prisma.orders.update({
        where: { order_id: newOrder.order_id },
        data: { total_paid: totalPaid, order_status_id:2 },
      });

      return updatedOrder;
    });

    return order;
  }
  findAll() {
    return this.prisma.orders.findMany();
  }

  findOne(id: number) {
    return this.prisma.orders.findUnique({
      where: {
        order_id: id
      }
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
