import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductService } from 'src/product/product.service';
import { OrderStatusService } from 'src/order-status/order-status.service';
import { RabbitMQModule } from 'src/rabbit-mq/rabbit-mq.module';
import { OrderConsumer } from './order-consumer.service';
import { PaymentConsumer } from './payment-consumer.service';

@Module({
  imports: [RabbitMQModule],
  controllers: [OrderController],
  providers: [OrderService, ProductService, OrderStatusService, OrderConsumer, PaymentConsumer],
})
export class OrderModule {}
