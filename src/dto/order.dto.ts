import {
  IsMobilePhone,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class OrderCreateDto {
  @ValidateNested()
  @IsNotEmptyObject({ message: '商品不能为空 ' })
  prods: OrderProdDto[];

  @IsString()
  @MinLength(2)
  province: string;
  @IsString()
  @MinLength(2)
  city: string;
  @IsString()
  @MinLength(2)
  county: string;
  @IsString()
  area: string;
  @IsString()
  @MinLength(2)
  receivername: string;
  @IsMobilePhone('zh-CN', {}, { message: '请输入11位手机号码' })
  receiverphone: string;
}

class OrderProdDto {
  @IsNumber()
  prodId: number;
  @IsNumber()
  @Min(1)
  @Max(20, { message: '最多支持购买20件' })
  number: number;
}
