import {
    IsString,
    IsEmail,
    IsOptional,
    Length,
    IsPhoneNumber,
  } from 'class-validator';
export class CreateCustomerDto {
    @IsString()
    @Length(1, 50, { message: 'Customer name must be between 1 and 50 characters.' })
    customer_name: string;
  
    @IsEmail({}, { message: 'Email must be a valid email address.' })
    @Length(1, 100, { message: 'Email must be between 1 and 100 characters.' })
    email: string;
  
    @IsOptional()
    @IsString()
    @IsPhoneNumber(null, { message: 'Phone number must be a valid phone number.' })
    @Length(1, 50, { message: 'Phone number must be between 1 and 50 characters.' })
    phone?: string;
  
    @IsString()
    @Length(6, 50, { message: 'Password must be between 6 and 50 characters.' })
    password: string;
}
