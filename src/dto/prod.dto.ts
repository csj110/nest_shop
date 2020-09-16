import { IsNumber, IsObject } from 'class-validator';
export class ProdCateQueryDto {
  cateId: number;
  @IsNumber()
  shopId: number;
  @IsNumber()
  page: number;
  @IsNumber()
  perPage: number;

  @IsObject()
  order: any;
}
