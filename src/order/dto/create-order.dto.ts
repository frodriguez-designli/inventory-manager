import { 
    IsInt, 
    IsPositive, 
    IsDateString, 
    IsOptional, 
    IsNumber, 
    IsArray,
    IsEnum,
    IsDate
  } from 'class-validator';
import { OrderStatusEnum } from 'src/utils/enum/order';
  
  export class CreateOrderDto {
    @IsInt()
    customer_id: number;
  
    @IsDate()
    order_date: Date;
  
    @IsInt()
    order_type: number;
  
    @IsInt()
    payment_type: number;
  
    @IsEnum(OrderStatusEnum)
    order_status_id: number;
  
    @IsArray()
    products: { product_id: number; quantity: number }[];
  
    @IsOptional()
    total_paid?: number; 
  }
  
  