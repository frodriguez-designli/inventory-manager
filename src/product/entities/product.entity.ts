import { Category } from "../../category/entities/category.entity";
import { Inventory } from "../../inventory/entities/inventory.entity";
import { OrderProduct } from "../../order-product/entities/order-product.entity";

export class Product {
    product_id: number;
  
    category_id: number;
  
    inventory_id: number;
  
    stock: number;
  
    price: string; // Decimal fields are typically represented as strings in TypeScript
  
    product_name: string;
  
    description?: string;
  
    createdAt: Date;
  
    updatedAt: Date;
  
    deletedAt?: Date;
  
    // Relations
    category: Category;
    inventory: Inventory; 
    orderProducts: OrderProduct[];
  }
  