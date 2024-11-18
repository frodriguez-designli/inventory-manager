import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductService } from 'src/product/product.service';
import { OrderStatusService } from 'src/order-status/order-status.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, ProductService, OrderStatusService],
})
export class OrderModule {}
