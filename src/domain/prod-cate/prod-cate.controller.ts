import { Controller, Get, HttpStatus, ParseIntPipe, Query } from '@nestjs/common';
import { ProdCateService } from './prod-cate.service';

const pipInt = new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE });

@Controller('cate')
export class ProdCateController {
  constructor(private cateService: ProdCateService) {}

  @Get('')
  async findShopCateTree(@Query('shopId', pipInt) shopId: number) {
    return await this.cateService.findAllByShop(shopId);
  }
}
