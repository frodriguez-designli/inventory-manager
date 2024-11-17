import { Product } from "src/product/entities/product.entity";

export class Inventory {
    inventory_id: number;
  
    inventory_name: string;
  
    products: Product[];
  }
  