import { IsInt, IsString, Length, IsOptional } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @Length(1, 50, { message: 'Inventory name must be between 1 and 50 characters.' })
  inventory_name: string;
}

