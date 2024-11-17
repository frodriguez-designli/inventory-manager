import { IsString, Length } from 'class-validator';

export class CreatePaymentTypeDto {
  @IsString()
  @Length(1, 50, { message: 'Payment type name must be between 1 and 50 characters.' })
  name: string;
}
