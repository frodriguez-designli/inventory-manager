import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: string) {
    return `This action returns a ${id} customer`;
  }

  findOneByUsername(username: string): Customer {
    return {
      customer_id: 1,
      customer_name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      password: 'secret',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
