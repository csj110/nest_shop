import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ProdCateQueryDto } from 'src/dto/prod.dto';
import { ProdService } from './prod.service';

@Controller('prod')
export class ProdController {
  constructor(private prodSesrvice: ProdService) {}

  @Get('/cate')
  async findProdByCate(@Query() queryDto: ProdCateQueryDto) {
    console.log(queryDto);
    return 'F';
    // return await this.prodSesrvice.findByCate(
    //   queryDto.cateId,
    //   queryDto.shopId,
    //   queryDto.page,
    //   queryDto.perPage,
    //   queryDto.order
    // );
  }

  @Get(':id')
  async findById(@Param('id') prodId: number) {
    return await this.prodSesrvice.findOne(prodId);
  }
}
