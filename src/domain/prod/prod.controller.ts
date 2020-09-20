import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Order, ProdCateQueryDto, ProdQuetyDto, ProdSort } from 'src/dto/prod.dto';
import { ParseOrderPipe, ParseSortPipe } from 'src/pipes/prod.pipe';


import { ProdService } from './prod.service';


const pipInt = new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })


@Controller('prod')
export class ProdController {
  constructor(private prodSesrvice: ProdService) { }



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

  @Get('')
  async findAllProdByShop(
    @Query("shopId", pipInt) shopId: number,
    @Query("page", pipInt) page: number,
    @Query("perPage", pipInt) perPage: number,
    @Query('sort', ParseSortPipe) sort?: ProdSort,
    @Query("order", ParseOrderPipe) order?: Order
  ) {
    return await this.prodSesrvice.findAllByShop(shopId, page, perPage, order, sort)
  }

  @Get(':id')
  async findById(@Param('id') prodId: number) {
    return await this.prodSesrvice.findOne(prodId);
  }
}
