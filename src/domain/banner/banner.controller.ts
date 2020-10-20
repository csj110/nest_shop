import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { BannerService } from './banner.service';

const pipInt = new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE });

@Controller('banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get('')
  async getBanners(@Query('type', pipInt) type: number) {
    return await this.bannerService.getByType(type);
  }
}
