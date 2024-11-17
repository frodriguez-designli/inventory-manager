import { Exclude } from 'class-transformer';

export class Customer {
  customer_id: number;

  customer_name: string;

  email: string;

  phone?: string;

  @Exclude() 
  password: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
