import { IsNumber } from 'class-validator';

export class CartAddDto {
  @IsNumber()
  prodId: number;

  @IsNumber()
  number: number;
}
