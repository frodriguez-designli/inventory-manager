import { Product } from "../../product/entities/product.entity";

export class Category {
    category_id: number;
  
    name: string;
  
    products: Product[];
  }
  