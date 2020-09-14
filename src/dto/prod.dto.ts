import { IsNumber, IsNumberString, IsObject, ValidateNested } from 'class-validator';
import { ProductEntity } from 'src/entities/product/prdouct.entity';

export class ProdCateQueryDto {
  
  cateId: number;
  @IsNumber()
  shopId: number;
  @IsNumber()
  page: number;
  @IsNumber()
  perPage: number;

  @IsObject()
  order: Sort<ProductEntity>;
}

type Sort<T> = {
  [P in keyof T]?: 1 | -1;
};
