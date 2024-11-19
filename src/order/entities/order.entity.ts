import { Customer } from "../../customer/entities/customer.entity";
import { OrderProduct } from "../../order-product/entities/order-product.entity";
import { OrderType } from "../../order-type/entities/order-type.entity";
import { PaymentType } from "../../payment-type/entities/payment-type.entity";

export class Order {
    order_id: number;
  
    customer_id: number;
  
    order_date: Date;
  
    order_type: number;
  
    payment_type: number;
  
    total_paid: number;
  
    createdAt: Date;
  
    updatedAt: Date;
  
    deletedAt?: Date;
  
    // Relations
    customer: Customer; 
    orderType: OrderType;
    paymentType: PaymentType;
    orderProducts: OrderProduct[];
  }
  