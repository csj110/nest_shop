import { IsString, MinLength } from 'class-validator'

export class CateDto {
  @IsString()
  @MinLength(2, { message: "长度应大于1" })
  name: string
}