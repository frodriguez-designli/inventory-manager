import { IsInt, IsString, IsOptional, IsDecimal, Min, Length, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsInt()
  @Min(1, { message: 'Category ID must be a positive integer.' })
  category_id: number;

  @IsInt()
  @Min(1, { message: 'Inventory ID must be a positive integer.' })
  inventory_id: number;

  @IsInt()
  @Min(0, { message: 'Stock must be a non-negative integer.' })
  stock: number;

  @IsDecimal({ decimal_digits: '2', force_decimal: false }, { message: 'Price must be a valid decimal with up to 2 decimal places.' })
  @IsPositive({ message: 'Price must be greater than 0.' })
  price: string;

  @IsString()
  @Length(1, 50, { message: 'Product name must be between 1 and 50 characters.' })
  product_name: string;

  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Description must be between 1 and 100 characters.' })
  description?: string;
}
