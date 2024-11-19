import { Order } from "../../order/entities/order.entity";
import { Product } from "../../product/entities/product.entity";

export class OrderProduct {
    shipment_id: number;
  
    order_id: number;
  
    product_id: number;

    quantity: number;

    shipment_date: Date;
  
    createdAt: Date;
  
    updatedAt: Date;
  
    deletedAt?: Date;
  
    // Relations
    order: Order;
    product: Product;
  }
  