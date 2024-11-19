import { Order } from "../../order/entities/order.entity";

export class PaymentType {
    payment_type: number;
  
    name: string;
  
    createdAt: Date;
  
    updatedAt: Date;
  
    deletedAt?: Date;
  
    // Relations
    orders: Order[]; 
  }
  