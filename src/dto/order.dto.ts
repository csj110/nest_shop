import { Type } from 'class-transformer';
import { IsArray, IsMobilePhone, IsNumber, IsString, MinLength, ValidateNested } from 'class-validator';

export class OrderCreateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShopOrderDto)
  shops: ShopOrderDto[];

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

class ShopOrderDto {
  @IsNumber()
  shopId: number;
  @IsString()
  prods: string;
  @IsNumber()
  freight: number;
  @IsNumber()
  price: number;
}
