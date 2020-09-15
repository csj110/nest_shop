import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ProdCateQueryDto } from 'src/dto/prod.dto';
import { ProdService } from './prod.service';

@Controller('prod')
export class ProdController {
  constructor(private prodSesrvice: ProdService) { }

  @Get(':id')
  async findById(@Param('id') prodId: number) {
    return await this.prodSesrvice.findOne(prodId);
  }

  @Get('/cate')
  async findProdByCate(@Body() queryDto: ProdCateQueryDto) {
    return await this.prodSesrvice.findByCate(
      queryDto.cateId,
      queryDto.shopId,
      queryDto.page,
      queryDto.perPage,
      queryDto.order
    );
  }
}
