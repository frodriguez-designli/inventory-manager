import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { PaymentTypeModule } from './payment-type/payment-type.module';
import { OrderTypeModule } from './order-type/order-type.module';
import { OrderProductModule } from './order-product/order-product.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from './rabbit-mq/rabbit-mq.module';

@Module({
  imports: [
    CustomerModule,

    ProductModule,
    OrderModule,
    CategoryModule,
    PaymentTypeModule,
    OrderTypeModule,
    OrderProductModule,
    AuthModule,
    PrismaModule,
    InventoryModule,
    OrderStatusModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
