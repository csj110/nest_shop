import { IsNumber, IsObject, } from 'class-validator';
import { ProductEntity } from 'src/entities/product/prdouct.entity';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptions';

export class ProdCateQueryDto {

  cateId: number;
  @IsNumber()
  shopId: number;
  @IsNumber()
  page: number;
  @IsNumber()
  perPage: number;

  @IsObject()
  order: FindOptionsOrder<ProductEntity>;
}

