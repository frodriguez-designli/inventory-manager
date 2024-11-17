import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { PrismaService } from '../prisma/prisma.service'

import { Customers, Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {

  constructor(private readonly prisma: PrismaService) {}
  create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customers.create({data:createCustomerDto});
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: string) {
    return `This action returns a ${id} customer`;
  }

  findOneByEmail(email: string): Promise<Customer> {
    return this.prisma.customers.findFirst({
      where: {
        email: email
      }
    })
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
