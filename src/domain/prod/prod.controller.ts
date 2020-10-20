import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Order, ProdCateQueryDto, ProdQuetyDto, ProdSort } from 'src/dto/prod.dto';
import { ParseOrderPipe, ParseSortPipe } from 'src/pipes/prod.pipe';

import { ProdService } from './prod.service';

const pipInt = new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE });

@Controller('prod')
export class ProdController {
  constructor(private prodSesrvice: ProdService) {}

  @Get('/cate')
  async findProdByCate(
    @Query('cateId', pipInt) cateId: number,
    @Query('pageNo', pipInt) page: number,
    @Query('pageSize', pipInt) perPage: number
  ) {
    return await this.prodSesrvice.findByCate(cateId, page, perPage);
  }

  @Get('')
  async findAllProdByShop(
    @Query('shopId', pipInt) shopId: number,
    @Query('page', pipInt) page: number,
    @Query('perPage', pipInt) perPage: number,
    @Query('sort', ParseSortPipe) sort?: ProdSort,
    @Query('order', ParseOrderPipe) order?: Order
  ) {
    return await this.prodSesrvice.findAllByShop(shopId, page, perPage, order, sort);
  }

  @Get(':id')
  async findById(@Param('id', pipInt) prodId: number) {
    return await this.prodSesrvice.findOne(prodId);
  }
}
