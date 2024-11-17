import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomerService } from 'src/customer/customer.service';
@Module({
  controllers: [AuthController],
  providers: [AuthService, CustomerService],
})
export class AuthModule {}
