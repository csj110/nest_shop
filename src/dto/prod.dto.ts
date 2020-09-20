import { IsNumber, IsObject } from 'class-validator';
export class ProdCateQueryDto {

  @IsNumber()
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
export class ProdQuetyDto {

  @IsNumber()
  shopId: number;

  @IsNumber()
  page: number;

  @IsNumber()
  perPage: number;

  @IsObject()
  order: any;
}

export enum ProdSort {
  PRICE = "price"
}

export type ProdSortType = keyof typeof ProdSort;
export enum Order {
  ASC = 'ASC',
  DESC = "DESC"
}