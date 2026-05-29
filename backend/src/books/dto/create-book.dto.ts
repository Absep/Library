import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsInt()
  quantity: number;

  @IsInt()
  availableCopies: number;

  @IsOptional()
  publishedYear?: number;

  @IsOptional()
  shelfLocation?: string;
}