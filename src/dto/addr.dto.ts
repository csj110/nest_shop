import { IsString, MinLength, Length, IsBoolean } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class AddrDto {
  @IsString()
  @MinLength(2, { message: '长度应大于1' })
  province: string;

  @IsString()
  @MinLength(2, { message: '长度应大于1' })
  city: string;

  @IsString()
  @MinLength(2, { message: '长度应大于1' })
  county: string;

  @IsString()
  @MinLength(2, { message: '长度应大于1' })
  area: string;

  @IsBoolean()
  default: boolean = false;

  @Expose({ name: 'receiver' })
  @IsString()
  @MinLength(2, { message: '长度应大于1' })
  receivername: string;

  @Expose({ name: 'phone' })
  @IsString()
  @Length(11, 11, { message: '长度应等于11' })
  receiverphone: string;
}
