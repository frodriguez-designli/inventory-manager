import { IsInt, IsString, Length, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 50, { message: 'Category name must be between 1 and 50 characters.' })
  name: string;
}

