import { 
    IsInt, 
    IsPositive, 
    IsDateString, 
    IsOptional, 
    IsNumber 
  } from 'class-validator';
  
  export class CreateOrderDto {
    @IsInt()
    @IsPositive({ message: 'Customer ID must be a positive integer.' })
    customer_id: number;
  
    @IsDateString()
    order_date: string;
  
    @IsInt()
    @IsPositive({ message: 'Order type must be a positive integer.' })
    order_type: number;
  
    @IsInt()
    @IsPositive({ message: 'Payment type must be a positive integer.' })
    payment_type: number;
  
    @IsNumber({}, { message: 'Total paid must be a valid number.' })
    total_paid: number;
  }
  