import { 
    IsInt, 
    IsPositive, 
    IsDateString, 
    IsOptional 
  } from 'class-validator';
  
  export class CreateOrderProductDto {
    @IsInt()
    @IsPositive({ message: 'Order ID must be a positive integer.' })
    order_id: number;
  
    @IsInt()
    @IsPositive({ message: 'Product ID must be a positive integer.' })
    product_id: number;

    @IsInt()
    @IsPositive({ message: 'Quantity must be a positive integer.' })
    quantity: number;
  
    @IsDateString()
    shipment_date: string;
  }
  