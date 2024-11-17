import { Module } from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { OrderProductController } from './order-product.controller';

@Module({
  controllers: [OrderProductController],
  providers: [OrderProductService],
})
export class OrderProductModule {}
