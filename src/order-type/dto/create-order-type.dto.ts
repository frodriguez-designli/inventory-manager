import { IsString, Length } from 'class-validator';

export class CreateOrderTypeDto {
  @IsString()
  @Length(1, 50, { message: 'Order type name must be between 1 and 50 characters.' })
  name: string;
}
